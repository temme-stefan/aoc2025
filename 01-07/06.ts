import {exampleData, starData} from "./06-data";

const parse = (data: string) => {
    const lines = data.split("\n").map(line => line.trim().split(/\s+/));
    const commands = lines.pop().map(line => {
        switch (line[0]) {
            case '+':
                return (arr: number[]) => arr.reduce((a, b) => a + b, 0);
            case '*':
                return (arr: number[]) => arr.reduce((a, b) => a * b, 1);

        }
        return (arr: number[]) => 0;
    })
    const lines2 = data.split("\n");
    lines2.pop();
    const numbersColumnwise: number[][] = [];
    let currentColumn: number[] = [];
    const splitter = " ".repeat(lines2.length);
    for (let i = lines2[0].length - 1; i >= 0; i--) {
        const col = lines2.map((line) => line[i]).join("");
        if (col === splitter) {
            numbersColumnwise.unshift(currentColumn);
            currentColumn = [];
        } else {
            currentColumn.push(Number(col.trim()));
        }
    }
    if (currentColumn.length > 0) {
        numbersColumnwise.unshift(currentColumn);
    }

    return {
        numberGrid: lines.map(line => line.map(Number)),
        commands,
        numbersColumnwise
    };
}
const solve = (data: string) => {
    const {numberGrid, commands, numbersColumnwise} = parse(data);
    let total = 0;
    let total2 = 0;
    for (let i = 0; i < commands.length; i++) {
        total += commands[i](numberGrid.map(row => row[i]));
        total2 += commands[i](numbersColumnwise[i]);
    }
    console.log(`Grand total: ${total}\nGrand total (columns): ${total2}`);
}
console.log("Advent of Code - 2025 - 6")
console.log("https://adventofcode.com/2025/day/6")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
