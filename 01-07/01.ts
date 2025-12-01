import {exampleData, exampleData2, starData} from "./01-data";

const numbercount = 100;
const pattern = /([LR])(\d+)/
const start = 50;

const parse = (data: string) => {
    const lines = data.split("\n").filter(l => l.length > 0);
    return lines.map(l => {
        const match = l.match(pattern);
        if (!match) throw new Error("Invalid line: " + l);
        const dir = match[1];
        const num = parseInt(match[2], 10);
        return dir === "L" ? -num : num;
    });
}
const solve = (data: string) => {
    const parsed = parse(data);
    let zeroCount = 0;
    let zeroWalked = 0;
    let currentPosition = start;
    for (const num of parsed) {
        const sign = Math.sign(num);
        const numAbs = Math.abs(num);
        for (let step = 0; step < numAbs; step++) {
            currentPosition += sign;
            if (currentPosition == numbercount) {
                currentPosition = 0;
            } else if (currentPosition == -1) {
                currentPosition = numbercount - 1;
            }
            if (currentPosition == 0) {
                zeroWalked += 1;
            }
        }
        if (currentPosition == 0) {
            zeroCount += 1;
        }

    }
    console.log("Result:", "\nStar 1:", zeroCount, "\nStar 2", zeroWalked);
}
console.log("Advent of Code - 2025 - 1")
console.log("https://adventofcode.com/2025/day/1")
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
