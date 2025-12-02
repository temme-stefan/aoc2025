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

const solve2 = (data: string) => {
    const parsed = parse(data);
    let zeroCount = 0;
    let zeroWalked = 0;
    let currentPosition = start;

    for (const num of parsed) {
        const oldPosition = currentPosition;
        const steps = Math.abs(num);
        const direction = Math.sign(num);

        // Volle Umdrehungen: Jede überquert 0 genau einmal
        const fullRotations = Math.floor(steps / numbercount);
        zeroWalked += fullRotations;

        // Rest-Schritte nach vollen Umdrehungen
        const remainingSteps = steps % numbercount;

        // Neue Position berechnen
        currentPosition = ((currentPosition + num) % numbercount + numbercount) % numbercount;

        // Star 1: Zähle, wenn wir auf 0 enden
        if (currentPosition === 0) {
            zeroCount++;
        }

        // Star 2: Prüfe Rest-Schritte für zusätzliche 0-Überquerung
        if (remainingSteps > 0) {
            if (direction > 0) {
                // Rechtsdrehung: Überqueren wir numbercount?
                if (oldPosition + remainingSteps >= numbercount) {
                    zeroWalked++;
                }
            } else {
                // Linksdrehung: Überqueren wir 0? Nur wenn wir nicht dort starten!
                if (oldPosition > 0 && remainingSteps >= oldPosition) {
                    zeroWalked++;
                }
            }
        }
    }

    console.log("Result:", "\nStar 1:", zeroCount, "\nStar 2:", zeroWalked);
}

console.time("Example v2");
console.log("Example v2")
solve2(exampleData);
console.timeEnd("Example v2")
console.time("Example2 v2");
console.log("Example2 v2")
solve2(exampleData2);
console.timeEnd("Example2 v2")
console.time("Stardata v2");
console.log("Stardata v2")
solve2(starData);
console.timeEnd("Stardata v2");