import {exampleData, starData} from "./05-data";

const parse = (data: string) => {
    const [freshRangesData, availableIngredientsData] = data.split("\n\n");
    const freshRanges = freshRangesData.split("\n").map(line => {
        const [from, to] = line.split("-").map(Number);
        return {from, to};
    });
    const availableIngredients = availableIngredientsData.split("\n").map(Number);
    return {freshRanges: mergeRanges(freshRanges), availableIngredients};

}

const mergeRanges = (ranges: { from: number, to: number }[]) => {
    ranges.sort((a, b) => a.from - b.from);
    const mergedRanges: { from: number, to: number }[] = [];
    let currentRange = ranges[0];
    for (let i = 1; i < ranges.length; i++) {
        const range = ranges[i];
        if (range.from <= currentRange.to + 1) {
            currentRange.to = Math.max(currentRange.to, range.to);
        } else {
            mergedRanges.push(currentRange);
            currentRange = range;
        }
    }
    mergedRanges.push(currentRange);
    return mergedRanges;
}

const rangeSize = (range: { from: number, to: number }) => {
    return range.to - range.from + 1;
}
const solve = (data: string) => {
    const {freshRanges, availableIngredients} = parse(data);
    const freshIngredients = new Set<number>();
    for (const ingredientId of availableIngredients) {
        if (freshRanges.some(range => ingredientId >= range.from && ingredientId <= range.to)) {
            freshIngredients.add(ingredientId);
        }
    }
    const totalFreshIngredients = freshRanges.reduce((acc, range) => acc + rangeSize(range), 0);
    console.log(`Fresh ingredients count: ${freshIngredients.size}`);
    console.log(`Total fresh ingredients count (including unavailable): ${totalFreshIngredients}`);
}
console.log("Advent of Code - 2025 - 5")
console.log("https://adventofcode.com/2025/day/5")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
