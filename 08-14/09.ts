import {exampleData, exampleData2, starData} from "./09-data";

const parse = (data: string) => {
    return data.split("\n").map(line => line.split(",").map(Number)) as [number, number][];
}

const pairs = <T>(arr: T[]): [T, T][] => {
    const result: [T, T][] = [];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            result.push([arr[i], arr[j]]);
        }
    }
    return result;
}

const rectArea = (p1: [number, number], p2: [number, number]): number => {
    return (Math.abs(p1[0] - p2[0]) + 1) * (Math.abs(p1[1] - p2[1]) + 1);
}

const isPointInside = (point: [number, number], verticalEdges: [[number, number], [number, number]][]): boolean => {
    const [px, py] = point;
    let crossings = 0;

    for (let i = 0; i < verticalEdges.length; i++) {
        const [[x1, y1], [, y2]] = verticalEdges[i];

        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        // Prüfen ob Strahl die Kante kreuzt
        if (px < x1 && py >= minY && py <= maxY) {
            crossings++;
        }
    }

    return crossings % 2 === 1;
}

const rectCorner = (p1: [number, number], p2: [number, number]): [number, number][] => {
    const xMin = Math.min(p1[0], p2[0]);
    const xMax = Math.max(p1[0], p2[0]);
    const yMin = Math.min(p1[1], p2[1]);
    const yMax = Math.max(p1[1], p2[1]);
    return [
        [xMin, yMin],
        [xMin, yMax],
        [xMax, yMin],
        [xMax, yMax],
    ];
}

const doSegmentsIntersect = (
    seg1: [[number, number], [number, number]],
    seg2: [[number, number], [number, number]]
): boolean => {
    const [[x1, y1], [x2, y2]] = seg1;
    const [[x3, y3], [x4, y4]] = seg2;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return false; // parallel

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    return t > 0 && t < 1 && u > 0 && u < 1; // echte Schnittpunkte
};

const getRectEdges = (p1: [number, number], p2: [number, number]): [[number, number], [number, number]][] => {
    const corners = rectCorner(p1, p2);
    return [
        [corners[0], corners[1]],
        [corners[1], corners[3]],
        [corners[3], corners[2]],
        [corners[2], corners[0]],
    ];
};

const isPointOnSegment = (
    point: [number, number],
    seg: [[number, number], [number, number]]
): boolean => {
    const [px, py] = point;
    const [[x1, y1], [x2, y2]] = seg;

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    if (px < minX || px > maxX || py < minY || py > maxY) return false;

    const crossProduct = (py - y1) * (x2 - x1) - (px - x1) * (y2 - y1);
    return Math.abs(crossProduct) < 1e-10;
};

const isRectInsidePolygon = (
    p1: [number, number],
    p2: [number, number],
    verticalEdges: [[number, number], [number, number]][],
    allEdges: [[number, number], [number, number]][]
): boolean => {
    const corners = rectCorner(p1, p2);

    // Prüfe alle Ecken (im Polygon oder auf Kante)
    for (const corner of corners) {
        let onEdge = false;
        for (const edge of allEdges) {
            if (isPointOnSegment(corner, edge)) {
                onEdge = true;
                break;
            }
        }
        if (!onEdge && !isPointInside(corner, verticalEdges)) {
            return false;
        }
    }

    // Prüfe zusätzliche Punkte auf jeder Rechteckkante, reicht hier für das problem aus, sauber: alle Punkte der Kante prüfen
    const rectEdges = getRectEdges(p1, p2);
    for (const [[x1, y1], [x2, y2]] of rectEdges) {
        // Prüfe Mittelpunkt und Viertelpunkte jeder Kante
        const points: [number, number][] = [
            [(x1 + x2) / 2, (y1 + y2) / 2], // Mittelpunkt
            [(3 * x1 + x2) / 4, (3 * y1 + y2) / 4], // 1/4 Punkt
            [(x1 + 3 * x2) / 4, (y1 + 3 * y2) / 4], // 3/4 Punkt
        ];

        for (const point of points) {
            let onEdge = false;
            for (const edge of allEdges) {
                if (isPointOnSegment(point, edge)) {
                    onEdge = true;
                    break;
                }
            }
            if (!onEdge && !isPointInside(point, verticalEdges)) {
                return false;
            }
        }
    }

    // Prüfe Schnittpunkte
    for (const rectEdge of rectEdges) {
        for (const polyEdge of allEdges) {
            if (doSegmentsIntersect(rectEdge, polyEdge)) {
                return false;
            }
        }
    }

    return true;
};

const solve = (data: string) => {
    const tiles = parse(data);
    let maxArea = 0;
    const pairedTiles = pairs(tiles);
    for (const [p1, p2] of pairedTiles) {
        const area = rectArea(p1, p2);
        if (area === 0) continue;
        if (area > maxArea) {
            maxArea = area;
        }
    }
    console.log(`Max Area between two tiles: ${maxArea}`);

    const edges: [[number, number], [number, number]][] = [];
    for (let i = 0; i < tiles.length; i++) {
        const from = tiles[i];
        const to = tiles[(i + 1) % tiles.length];
        edges.push([from, to]);
    }
    const verticalEdges = edges.filter(edge => edge[0][0] === edge[1][0]);

    let maxAreaInside = 0;
    for (const [p1, p2] of pairedTiles) {
        const area = rectArea(p1, p2);
        if (area > maxAreaInside &&  isRectInsidePolygon(p1, p2, verticalEdges, edges)) {
            maxAreaInside = area;
        }
    }
    console.log(`Max Area inside the polygon: ${maxAreaInside}`);
}
console.log("Advent of Code - 2025 - 9")
console.log("https://adventofcode.com/2025/day/9")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Example2");
console.log("Example2")
solve(exampleData2);
console.timeEnd("Example2")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
