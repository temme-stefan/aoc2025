import {exampleData, starData} from "./03-data";

const parse = (data: string) => {
    const banks = data.split("\n");
    return banks.map(bank => bank.split('').map(Number));
}

const largestBatteryInBank = (bank: number[], batterieCount = 2) => {
    const numbers = [];
    let leftBorder = 0;

    for (let i = 0; i < batterieCount; i++) {
        const rightBorder = bank.length - batterieCount + i + 1;
        let maxIndex = leftBorder;

        for (let j = leftBorder + 1; j < rightBorder; j++) {
            if (bank[j] > bank[maxIndex]) {
                maxIndex = j;
            }
        }

        numbers.push(bank[maxIndex]);
        leftBorder = maxIndex + 1;
    }
    return numbers.reduce((a, b) => a * 10 + b, 0);
}
const solve = (data: string) => {
    const batteriesByBank = parse(data);

    const sum1 = batteriesByBank.reduce((sum, bank) => sum + largestBatteryInBank(bank), 0);
    const sum2 = batteriesByBank.reduce((sum, bank) => sum + largestBatteryInBank(bank,12), 0);
    console.log("Sum of largest batteries in each bank:","\nStar1:", sum1,"\nStar2:", sum2);
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
