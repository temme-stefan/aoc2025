import {exampleData, starData} from "./10-data";
import Solver from "../node_modules/javascript-lp-solver/src/main.js";

const parse = (data: string) => {
    const maschineLines = data.split("\n").map(line => line.trim());
    return maschineLines.map(line => {
        const [, lightPattern, buttonPatterns, joltagePattern] = line.match(/^\[([.#]+)] (.*) \{((\d+,?)+)}$/)!;
        const buttons = buttonPatterns.split(" ").map(pattern => pattern.substring(1, pattern.length - 1).split(",").map(num => parseInt(num)));
        const joltage = joltagePattern.split(",").map(num => parseInt(num));
        const lights = lightPattern.split("").map(char => char === "#");
        return {lights, buttons, joltage};
    })
}
type TMaschine = ReturnType<typeof parse>[0];

const findFewestPressesLights = (maschine: TMaschine): number => {
    const {lights, buttons} = maschine;
    const state: [boolean[], number][] = [[lights.map(() => false), 0]]; // All lights off

    const stateSet = new Set<string>();
    const toKey = (lights: boolean[]) => lights.map(l => l ? "#" : ".").join("");
    const reached = (lights: boolean[]) => lights.every((l, i) => l == maschine.lights[i]);
    while (state.length > 0) {
        const [currentLights, presses] = state.shift()!;
        if (reached(currentLights)) return presses;
        for (const button of buttons) {
            const newLights = [...currentLights];
            for (const index of button) {
                newLights[index] = !newLights[index];
            }
            const key = toKey(newLights);
            if (stateSet.has(key)) continue; // Already visited
            stateSet.add(key);
            state.push([newLights, presses + 1]);
        }
    }
    return -1;
}

const findFewestPressesJoltage = (maschine: TMaschine): number => {
    const {buttons, joltage} = maschine;
    const model: any = {optimize: "count", opType: "min", constraints: {}, variables: {}, ints: {}};
    joltage.forEach((joltageValue, index) => {
        model.constraints[`joltage_${index}`] = {equal: joltageValue};
    });
    buttons.forEach((button, index) => {
        const varName = `button_${index}`;
        model.variables[varName] = {count: 1};
        button.forEach((button) => {
            model.variables[varName][`joltage_${button}`] = 1;
        });
        model.ints[varName] = 1;
    });
    const results = Solver.Solve(model);
    return results.result as number;
}

const solve = (data: string) => {
    const maschines = parse(data);
    let total = 0;
    let totalJoltage = 0
    maschines.forEach((maschine, index) => {
        const presses = findFewestPressesLights(maschine);
        const joltagePresses = findFewestPressesJoltage(maschine);
        console.log(`  Maschine ${index + 1}: ${presses} light presses, ${joltagePresses} joltage presses`);
        total += presses;
        totalJoltage += joltagePresses;
    });
    console.log(`Total light presses: ${total}, Total joltage presses: ${totalJoltage}`);
}
console.log("Advent of Code - 2025 - 10")
console.log("https://adventofcode.com/2025/day/10")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
