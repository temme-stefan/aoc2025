import 'dotenv/config';
import process from "node:process";
import {getJson} from "./getData.js";

interface Member {
    id: string;
    name: string;
    local_score: number;
    stars: number;
}

interface CompletionStar {
    get_star_ts: number;
}

interface MemberData {
    id: string;
    name: string;
    local_score: number;
    stars: number;
    completion_day_level: Record<string, Record<string, CompletionStar>>;
}

interface LeaderboardResponse {
    members: Record<string, MemberData>;
}

const year = process.env.YEAR;
const leaderBoard = process.env.LEADERBOARD;
if (!Number.isFinite(parseInt(leaderBoard))) {
    throw "leaderboard not given"
}
const url = `https://adventofcode.com/${year}/leaderboard/private/view/${leaderBoard}.json`;
const data = await getJson<LeaderboardResponse>(url);
const memberData: Record<string, MemberData> = data?.members ?? {};

const members = new Map<string, Member>()

const starKeyToMemberTime = new Map<string, Map<string, number>>()
Object.values(memberData).forEach(({id, name, local_score, stars, completion_day_level}: MemberData) => {
    members.set(id, {id, name: name ?? `anonym #${id}`, local_score, stars});
    const a = new Map(
        Object.entries(completion_day_level).flatMap(
            ([day, stars]) => Object.entries(stars).map(
                ([star, {get_star_ts}]) => [`${day}-${star}`, get_star_ts] as [string, number]
            )
        )
    );
    [...a.entries()].forEach(([key, time]) => {
        starKeyToMemberTime.has(key) || starKeyToMemberTime.set(key, new Map());
        starKeyToMemberTime.get(key).set(id, time);
    })
});
const starwise = [...starKeyToMemberTime.keys()].sort((a, b) => {
    const [a0, a1] = a.split("-").map(Number);
    const [b0, b1] = b.split("-").map(Number);
    return Math.sign(a0 == b0 ? a1 - b1 : a0 - b0);
}).map(key => {
    const memberTime = starKeyToMemberTime.get(key);
    const sortedMember = [...memberTime.entries()].sort((a, b) => Math.sign(a[1] - b[1])).map(x => x[0]);
    const memberScores = Object.fromEntries([...members.values()].map(m => [m.name, memberTime.has(m.id) ? members.size - sortedMember.indexOf(m.id) : 0]));
    return {key, ...memberScores};
})

console.table([...members.values()].sort((a, b) => -Math.sign(a.local_score - b.local_score)));
console.table(starwise);


