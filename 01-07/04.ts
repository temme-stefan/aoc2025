import {exampleData, starData} from "./04-data";

const parseInput = (data: string) => {
    return data.split('\n').map(line => line.split("").map(cell => ({value: cell, free: cell == '.'})));
}
type TMap = ReturnType<typeof parseInput>;

const countAdjacentRolls = (row: number, col: number, map: TMap) => {
    let count = 0;
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
            if (rowOffset === 0 && colOffset === 0) continue;
            const checkRow = row + rowOffset;
            const checkCol = col + colOffset;
            if (checkCol >= 0 && checkCol < map[row].length && checkRow >= 0 && checkRow < map.length && !map[checkRow][checkCol].free) {
                count++;
            }
        }
    }
    return count;
}
const removeMoveableRolls = (map: TMap) => {
    let count = 0;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (!map[i][j].free) {
                const adjacentRolls = countAdjacentRolls(i, j, map);
                if (adjacentRolls < 4) {
                    count++;
                    map[i][j].value = 'x';
                    map[i][j].free = true;
                }
            }
        }
    }
    return count;
}
const solve = (data: string) => {
    const map = parseInput(data);
    let count1 = removeMoveableRolls(map);
    let count2 = count1;
    let lastCount = count1;
    while (lastCount > 0) {
        lastCount = removeMoveableRolls(map);
        count2 += lastCount;
    }
    console.log(`There are ${count1} Rolls with less then 4 adjacent Rolls.\nIn Total ${count2} Rolls can be removed.`);
// No Picture found
// console.log(map.map(line => line.map(cell => cell.value == "@" ? " " : "#").join("")).join("\n"));

}
console.log("Advent of Code - 2025 - 4")
console.log("https://adventofcode.com/2025/day/4")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
