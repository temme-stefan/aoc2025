import {exampleData, starData} from "./03-data";

const parse = (data: string) => {
    const banks = data.split("\n");
    return banks.map(bank => bank.split('').map(Number));
}

const largestBatteryInBank = (bank: number[]) => {
    const lArray = bank.slice(0,-1);
    let lMaxIndex = lArray.reduce((a, b,i) => lArray[a]<b?i:a, 0);
    const rArray = bank.slice(lMaxIndex+1);
    let rMaxIndex = rArray.reduce((a, b,i) => rArray[a]<b?i:a, 0);
    return lArray[lMaxIndex]*10+rArray[rMaxIndex];
}
const solve = (data: string) => {
    const batteriesByBank = parse(data);

    const sum1 = batteriesByBank.reduce((sum, bank) => sum + largestBatteryInBank(bank), 0);

    console.log("Sum of largest batteries in each bank:", sum1);
}
console.log("Advent of Code - 2025 - 3")
console.log("https://adventofcode.com/2025/day/3")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
