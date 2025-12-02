import {exampleData, starData} from "./02-data";

const parse = (data: string) => {
    return data.split(',').map(range => {
        const [from, to] = range.split('-').map(Number);
        return {from, to};
    });
}

const digitCount = (n: number) => {
    if (n === 0) return 1;
    return Math.floor(Math.log10(Math.abs(n))) + 1;
};
const isInvalid = (n: number) => {
    const count = digitCount(n);
    if (count % 2 == 1) {
        return false;
    }
    const divisor = 10 ** (count / 2);
    const left = Math.floor(n / divisor);
    const right = n % divisor;
    return left == right;

}
const solve = (data: string) => {
    const ranges = parse(data);
    let sum = 0;
    ranges.forEach(({from,to}) => {
        for (let n = from; n <= to; n++) {
            if (isInvalid(n)) {
                sum+=n;
            }
        }
    });
    console.log("Invalid numbers count:", sum);

}
console.log("Advent of Code - 2025 - 2")
console.log("https://adventofcode.com/2025/day/2")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
