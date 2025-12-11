import {exampleData,exampleData2, starData} from "./11-data";

const parse = (data: string) => {
    return new Map<string, string[]>(
        data.split('\n').map(line => {
            const [key, value] = line.split(": ");
            const targets = value.split(" ").map(v => v.trim());
            return [key, targets] as [string, string[]];
        })
    );
}
const getAllPathes = (from: string, to: string, nodes: Map<string, string[]>) => {
    let next = [[from]];
    let pathes: string[][] = []
    while (next.length > 0) {
        const current = next.pop()!;
        const last = current[current.length - 1]

        if (last === to) {
            pathes.push(current);
            continue;
        }

        const nextNeighbors = nodes.get(last) || [];
        const check = new Set(current);
        for (const neighbor of nextNeighbors) {
            if (!check.has(neighbor)) {
                next.push([...current, neighbor]);
            }
        }
    }
    return pathes;
}
const solve = (data: string,from:string,to:string, filter=(s:string[][])=>s) => {
    const nodes = parse(data);
    const pathes = getAllPathes(from,to, nodes);
    // console.log(pathes.map(p=>p.join(", ")).join("\n"));
    console.log(`Pathes from ${from} to ${to}`, filter(pathes).length);
}
const filterStar2 = (s:string[][]) => s.filter(path=>{
    const set= new Set(path);
    return set.has("dac") && set.has("fft");
})

console.log("Advent of Code - 2025 - 11")
console.log("https://adventofcode.com/2025/day/11")
console.time("Example");
console.log("Example")
solve(exampleData ,"you","out");
solve(exampleData2 ,"svr","out", filterStar2);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData,"you","out");
console.timeEnd("Stardata");
