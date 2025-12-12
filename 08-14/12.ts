import {exampleData, starData} from "./12-data";

class Region {
    map: number[][] = []
    width: number;
    height: number;
    hashCache: number = 0;
    hashValid: boolean = false;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.map = Array.from({length: height}).map(() => Array.from({length: width}).map(() => -1));
        this.updateHash();
    }

    updateHash() {
        this.hashCache = this.computeHashVariant(false, false);
        this.hashValid = true;
    }

    getMirroredHashes() {
        const hashes: number[] = [];

        // Original
        hashes.push(this.computeHashVariant(false, false));

        // Horizontal gespiegelt
        hashes.push(this.computeHashVariant(true, false));

        // Vertikal gespiegelt
        hashes.push(this.computeHashVariant(false, true));

        // Horizontal + Vertikal gespiegelt
        hashes.push(this.computeHashVariant(true, true));
        return hashes;
    }

    computeHashVariant(flipH: boolean, flipV: boolean): number {
        let hash = 2166136261;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const actualX = flipH ? this.width - 1 - x : x;
                const actualY = flipV ? this.height - 1 - y : y;

                hash ^= this.map[actualY][actualX] + 1;
                hash = Math.imul(hash, 16777619);
            }
        }
        return hash >>> 0;
    }


    getHash(): number {
        if (!this.hashValid) {
            this.updateHash();
        }
        return this.hashCache;
    }

    canPlace(present: PresentRepresentation, x: number, y: number) {
        for (const {x: px, y: py} of present.cellIterator(x, y)) {
            if (px < 0 || px >= this.width || py < 0 || py >= this.height || this.map[py][px] !== -1) {
                return false;
            }
        }
        return true;
    }

    remove(present: PresentRepresentation, x: number, y: number) {
        for (const {x: px, y: py} of present.cellIterator(x, y)) {
            this.map[py][px] = -1;
        }
        this.hashValid = false;
    }

    add(present: PresentRepresentation, x: number, y: number) {
        for (const {x: px, y: py} of present.cellIterator(x, y)) {
            this.map[py][px] = present.name;
        }
        this.hashValid = false;
    }

    clone() {
        const newMap = new Region(this.width, this.height);
        newMap.map = this.map.map(r => r.slice());
        newMap.hashValid = this.hashValid
        newMap.hashCache = this.hashCache;
        return newMap;
    }

    toString() {
        return "\n" + this.map.map(r => r.map(c => c == -1 ? "." : `${c}`).join("")).join("\n") + "\n";
    }

}

class PresentRepresentation {
    name: number;
    cells: { x: number, y: number }[] = [];
    data: string[][];
    width: number;
    height: number;

    * cellIterator(offsetX: number, offsetY: number) {
        for (const {x, y} of this.cells) {
            yield {x: x + offsetX, y: y + offsetY};
        }
    }

    constructor(name: number, data: string[][]) {
        this.name = name;
        this.data = data;
        this.width = data[0].length;
        this.height = data.length;
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] === "#") {
                    this.cells.push({x: j, y: i});
                }
            }
        }


    }

    toString() {
        return this.data.map(r => r.join("")).join("\n") + "\n";
    }
}


const parse = ((data: string) => {
    const presents = data.split("\n\n");
    const regions = presents.pop().split("\n");

    return {
        presents: presents.map(p => {
            const [name, ...rows] = p.split("\n").map(line => line.split(""));
            const representations = new Map<string, string[][]>
            let current = rows;
            for (let i = 0; i < 4; i++) {
                const s = presentToString(current);
                if (!representations.has(s)) {
                    representations.set(s, current);
                }
                const rev = flipPresent(current);
                const r = presentToString(rev);
                if (!representations.has(r)) {
                    representations.set(r, rev);
                }
                current = rotateClockwisePresent(current);
            }
            const ind = parseInt(name.slice(0, name.length - 1).join(""));
            return {
                name: ind,
                representations: [...representations.values()].map(r => new PresentRepresentation(ind, r)),
                count: rows.flat().filter(c => c == "#").length
            };
        }),
        regions: regions.map(r => {
            const [size, ...indexCounts] = r.split(" ");
            const [width, height] = size.substring(0, size.length - 1).split("x").map(Number);
            return {
                width, height
                , needed: indexCounts.map(Number),
                initialMap: new Region(width, height)
            }
        })
    }
});
const rotateClockwisePresent = (present: string[][]) => {
    const n = present[0].length;
    const m = present.length;
    return Array.from({length: n}).map((_, i) => Array.from({length: m}).map((_, j) => present[n - 1 - j][i]));
}

const flipPresent = (present: string[][]) => {
    return present.map(r => r.toReversed());
}

const presentToString = (p: string[][]) => p.map(r => r.join("")).join("\n");

const solve = (data: string) => {
    const {presents, regions} = parse(data);
    let validRegions = 0;
    for (const {width, height, needed, initialMap} of regions) {
        const totalSpaceNeeded = needed.reduce((a, count, index) => a + presents[index].count * count, 0);
        const totalSpaceAvailable = width * height;
        if (totalSpaceAvailable < totalSpaceNeeded) {
            console.log("Region too small:", width + "x" + height, needed);
            continue; //hartes Kriterium um schnell viele Regionen zu verwerfen
        }
        // /*
           console.log("doing it the hardway")

        /*/
        else {
            validRegions++ //Das reicht aus...
            continue
        }
        //*/
        const getMapKey = (map: Region) => map.getHash();
        const getNeededKey = (needed: number[]) => needed.join(",");

        const check = new Map<ReturnType<typeof getMapKey>, Set<ReturnType<typeof getNeededKey>>>();

        let lastMapWithValidPlacement: Region = null
        const step = (map: Region, needed: number[]) => {
            const neededLeft = needed.reduce((a, b) => a + b, 0);
            if (neededLeft == 0) {
                return true;
            }
            const mapKey = getMapKey(map);
            const neededKey = getNeededKey(needed);
            if (!check.has(mapKey)) {
                check.set(mapKey, new Set());
            }
            const checkSet = check.get(mapKey);
            if (checkSet.has(neededKey)) {
                return false;
            }
            const mapKeys = map.getMirroredHashes();
            for (const mk of mapKeys) {
                if (!check.has(mk)) {
                    check.set(mk, new Set());
                }
                check.get(mk).add(neededKey);
            }
            for (let i = 0; i < needed.length; i++) {
                if (needed[i] > 0) {
                    const present = presents[i];
                    let notFound = true;
                    const newNeeded = needed.slice();
                    newNeeded[i]--;
                    for (const p of present.representations) {
                        const maxX = map.width - p.width + 1;
                        const maxY = map.height - p.height + 1;
                        for (let i = 0; notFound && i < maxX; i++) {
                            for (let j = 0; notFound && j < maxY; j++) {

                                if (map.canPlace(p, i, j)) {
                                    map.add(p, i, j);
                                    notFound = !step(map, newNeeded);
                                    if (!notFound && neededLeft == 1) {
                                        lastMapWithValidPlacement = map.clone();
                                    }
                                    map.remove(p, i, j);
                                }
                            }
                        }
                    }
                    if (notFound) {
                        return false;
                    }
                }
            }
            return true;
        }
        if (step(initialMap, needed)) {
            console.log("Valid region found:", width + "x" + height, needed, lastMapWithValidPlacement.toString());
            validRegions++;
        } else {
            console.log("No valid region:", width + "x" + height, needed);
        }
    }
    console.log(validRegions)
}
console.log("Advent of Code - 2025 - 12")
console.log("https://adventofcode.com/2025/day/12")
console.time("Example");
console.log("Example")
solve(exampleData);
console.timeEnd("Example")
console.time("Stardata");
console.log("Stardata")
solve(starData);
console.timeEnd("Stardata");
