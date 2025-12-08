import {exampleData, starData} from "./07-data";

const parse = (data: string) => {
    const lines = data.split("\n").map(line => line.trim());
    const grid = lines.map(line => line.split("").map(char => {
            const free = char === '.';
            const start = char === 'S';
            const splitter = char === '^';
            return {free, start, splitter, beamCount:start?1:0};
        }
    ));
    const startPosition = {x: 0, y: 0};
    loop: {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x].start) {
                    startPosition.x = x;
                    startPosition.y = y;
                    break loop;
                }
            }
        }
    }
    return {
        grid,
        startPosition
    };
}

type TCell = { x: number, y: number };
const solve = (data: string) => {
    const {grid, startPosition} = parse(data);

    let count = 0;
    const beams = [startPosition];
    let countWays = 0;
    while (beams.length > 0) {
        const beam = beams.shift();
        const beamCount = grid[beam.y][beam.x].beamCount;
        if (grid.length - 1 == beam.y) { // reached bottom
            countWays+=beamCount;
            continue;
        }
        const addedBeams: TCell[] = [];
        if (grid[beam.y + 1][beam.x].splitter) {
            addedBeams.push({x: beam.x - 1, y: beam.y + 1});
            addedBeams.push({x: beam.x + 1, y: beam.y + 1});

            count++;
        } else {
            addedBeams.push({x: beam.x, y: beam.y + 1});
        }
        for (const addedBeam of addedBeams) {
            if (grid[addedBeam.y][addedBeam.x].beamCount==0) {
                beams.push(addedBeam); // Star 1: continue only a single beam;
            }
            grid[addedBeam.y][addedBeam.x].beamCount+=beamCount; //Star 2: remember times beam reaches this point

        }
    }
    console.log("Splitted beams:", count);
    console.log("Possible ways:", countWays);

}
console.log("Advent of Code - 2025 - 7")
console.log("https://adventofcode.com/2025/day/7")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
