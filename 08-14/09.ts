import {exampleData, exampleData2, starData} from "./09-data";

type TCoordinate = [number, number];
type TEdge = [TCoordinate, TCoordinate];

const parse = (data: string) => {
    return data.split("\n").map(line => line.split(",").map(Number)) as TCoordinate[];
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

const rectArea = (p1: TCoordinate, p2: TCoordinate): number => {
    return (Math.abs(p1[0] - p2[0]) + 1) * (Math.abs(p1[1] - p2[1]) + 1);
}

const isPointInside = (point: TCoordinate, verticalEdges: TEdge[]): boolean => {
    const [px, py] = point;
    let crossings = 0;

    for (let i = 0; i < verticalEdges.length; i++) {
        const [[x1, y1], [, y2]] = verticalEdges[i];

        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        // Prüfe, ob Strahl die Kante kreuzt
        if (px < x1 && py >= minY && py <= maxY) {
            crossings++;
        }
    }

    return crossings % 2 === 1;
}

const rectCorner = (p1: TCoordinate, p2: TCoordinate): TCoordinate[] => {
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
    seg1: TEdge,
    seg2: TEdge
): boolean => {
    const [[x1, y1], [x2, y2]] = seg1;
    const [[x3, y3], [x4, y4]] = seg2;

    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) return false; // parallel

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

    return t > 0 && t < 1 && u > 0 && u < 1; // echte Schnittpunkte
};

const getRectEdges = (p1: TCoordinate, p2: TCoordinate): TEdge[] => {
    const corners = rectCorner(p1, p2);
    return [
        [corners[0], corners[1]],
        [corners[1], corners[3]],
        [corners[3], corners[2]],
        [corners[2], corners[0]],
    ];
};

const isPointOnSegment = (
    point: TCoordinate,
    seg: TEdge
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

const checkPoint = (allEdges: TEdge[], point: TCoordinate, verticalEdges: TEdge[]) => {
    let inside = true
    let onEdge = false;
    for (const edge of allEdges) {
        if (isPointOnSegment(point, edge)) {
            onEdge = true;
            break;
        }
    }
    if (!onEdge && !isPointInside(point, verticalEdges)) {
        inside = false;
    }
    return inside;
}
const isRectInsidePolygon = (
    p1: TCoordinate,
    p2: TCoordinate,
    verticalEdges: TEdge[],
    allEdges: TEdge[]
): boolean => {
    const corners = rectCorner(p1, p2);

    // Prüfe alle Ecken (im Polygon oder auf Kante)
    if (corners.some(p => !checkPoint(allEdges, p, verticalEdges))) {
        return false
    }

    // Prüfe zusätzliche Punkte auf jeder Rechteckkante, reicht hier für das problem aus, sauber: alle Punkte der Kante prüfen
    const rectEdges = getRectEdges(p1, p2);
    for (const [[x1, y1], [x2, y2]] of rectEdges) {
        // Prüfe Mittelpunkt und Viertelpunkte jeder Kante
        const points: TCoordinate[] = [
            [(x1 + x2) / 2, (y1 + y2) / 2], // Mittelpunkt
            [(3 * x1 + x2) / 4, (3 * y1 + y2) / 4], // 1/4 Punkt
            [(x1 + 3 * x2) / 4, (y1 + 3 * y2) / 4], // 3/4 Punkt
        ];
        if (points.some(p => !checkPoint(allEdges, p, verticalEdges))) {
            return false
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

    const edges: TEdge[] = [];
    for (let i = 0; i < tiles.length; i++) {
        const from = tiles[i];
        const to = tiles[(i + 1) % tiles.length];
        edges.push([from, to]);
    }
    const verticalEdges = edges.filter(edge => edge[0][0] === edge[1][0]);

    let maxAreaInside = 0;
    for (const [p1, p2] of pairedTiles) {
        const area = rectArea(p1, p2);
        if (area > maxAreaInside && isRectInsidePolygon(p1, p2, verticalEdges, edges)) {
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
