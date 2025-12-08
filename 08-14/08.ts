import {exampleData, starData} from "./08-data";

type TCoord = { x: number, y: number, z: number };
const distance = (a: TCoord, b: TCoord): number => {
    return Math.sqrt(
        Math.pow(a.x - b.x, 2) +
        Math.pow(a.y - b.y, 2) +
        Math.pow(a.z - b.z, 2)
    );
}

const parse = (data: string): TCoord[] => {
    const rows = data.split('\n');
    return rows.map(row => {
        const [x, y, z] = row.split(',').map(Number);
        return {x, y, z}
    });
}

const toString = (coord: TCoord): string => {
    return `(${coord.x},${coord.y},${coord.z})`;
}

const coordinatePairsSortedByDistance = (coords: TCoord[]): { pair: [TCoord, TCoord], distance: number }[] => {
    const pairs: { pair: [TCoord, TCoord], distance: number }[] = [];
    for (let i = 0; i < coords.length; i++) {
        for (let j = i + 1; j < coords.length; j++) {
            const dist = distance(coords[i], coords[j]);
            pairs.push({pair: [coords[i], coords[j]], distance: dist});
        }
    }
    pairs.sort((a, b) => a.distance - b.distance);
    return pairs;
}
const solve = (data: string, times: number) => {
    const coords = parse(data);
    const pairs = coordinatePairsSortedByDistance(coords);
    let circuits: Set<TCoord>[] = coords.map(c => new Set([c]));
    const mergeNextPair = (i: number) => {
        const currentPair = pairs[i];
        const currentCircuits = currentPair.pair.map(c => circuits.find(circuit => circuit.has(c)!));
        if (currentCircuits[0] !== currentCircuits[1]) {
            // merge circuits
            currentCircuits[0].forEach(c => currentCircuits[1].add(c));
            circuits = circuits.filter(circuit => circuit !== currentCircuits[0]);
        }
    }
    for (let i = 0; i < times; i++) {
        mergeNextPair(i);
    }
    const sizes = circuits.map(c => c.size).sort((a, b) => b - a);
    console.log(`After ${times} merges, there are ${circuits.length} circuits with sizes: ${sizes.slice(0,10).join(', ')}... . The product of the three largest is ${sizes.slice(0, 3).reduce((a, b) => a * b, 1)}`);
    let i = times;
    while (circuits.length > 1) {
        mergeNextPair(i++);
    }

    console.log(`Last pair x-Product: ${pairs[i - 1].pair[0].x * pairs[i - 1].pair[1].x}`);
}


console.log("Advent of Code - 2025 - 8")
console.log("https://adventofcode.com/2025/day/8")
console.time("Example");
console.log("Example")
solve(exampleData, 10);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData, 1000);
console.timeEnd("Stardata");
