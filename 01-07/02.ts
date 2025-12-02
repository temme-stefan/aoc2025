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
const isInvalidStar1 = (n: number) => {
    const count = digitCount(n);
    if (count % 2 == 1) {
        return false;
    }
    const divisor = 10 ** (count / 2);
    const left = Math.floor(n / divisor);
    const right = n % divisor;
    return left == right;
}

const isInvalidStar2 = (n: number) => {
    const count = digitCount(n);
    let valid = true;
    for (let i = 1; valid && i <= Math.floor(count / 2); i++) {
        if (count % i != 0) {
            continue;
        }
        const divisor = 10 ** i;
        let equal = true;
        const right = n % divisor;
        let left = Math.floor(n / divisor);
        while (equal && left > 0) {
            equal = right == left % divisor;
            left = Math.floor(left / divisor);
        }
        valid = !equal;
    }
    return !valid;
}
const solve = (data: string) => {
    const ranges = parse(data);
    let sum1 = 0;
    let sum2 = 0;
    ranges.forEach(({from, to}) => {
        for (let n = from; n <= to; n++) {
            if (isInvalidStar1(n)) {
                sum1 += n;
            }
            if (isInvalidStar2(n)) {
                sum2 += n;
            }
        }
    });
    console.log("Invalid numbers count:", "\n Star 1", sum1, "\n Star 2", sum2);

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


const generatePatterns = (maxDigits: number, maxRepetitions: number): Set<number> => {
    const patterns = new Set<number>();

    for (let reps = 2; reps <= maxRepetitions; reps++) {
        for (let segmentLen = 1; segmentLen * reps <= maxDigits; segmentLen++) {
            // Alle möglichen Segmente dieser Länge
            const start = 10 ** (segmentLen - 1); // z.B. 10 für 2-stellig
            const end = 10 ** segmentLen - 1;     // z.B. 99 für 2-stellig

            for (let segment = start; segment <= end; segment++) {
                const pattern = segment.toString().repeat(reps);
                patterns.add(Number(pattern));
            }
        }
    }

    return patterns;
};

const solve2 = (data: string) => {
    const ranges = parse(data);
    const inRange = (n: number) => ranges.some(({from, to}) => n >= from && n <= to);
    const max = ranges.reduce((max, {to}) => Math.max(to, max), 0);
    const maxCountDigits = digitCount(max);
    const patternsV1 = generatePatterns(maxCountDigits, 2);
    const patternsV2 = generatePatterns(maxCountDigits, maxCountDigits);
    let sum1 = 0;
    let sum2 = 0;
    for (const number of patternsV1) {
        if (inRange(number)) {
            sum1 += number;
        }
    }
    for (const number of patternsV2) {
        if (inRange(number)) {
            sum2 += number;
        }
    }
    console.log("Invalid numbers count v2:", "\n Star 1", sum1, "\n Star 2", sum2);
}

console.time("Example v2");
console.log("Example v2")
solve2(exampleData);
console.timeEnd("Example v2")
console.time("Stardata v2");
console.log("Stardata v2")
solve2(starData);
console.timeEnd("Stardata v2");