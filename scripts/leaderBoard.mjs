import 'dotenv/config';
import process from "node:process";
import {getJson} from "./getData.mjs";

const year = process.env.YEAR;
const leaderBoard = process.env.LEADERBOARD;
if (!Number.isFinite(parseInt(leaderBoard))) {
    throw "leaderboard not given"
}
const url = `https://adventofcode.com/${year}/leaderboard/private/view/${leaderBoard}.json`;
const data = await getJson(url);
const memberData = data.members ?? [];

const members = new Map()

const starKeyToMemberTime = new Map()
Object.values(memberData).forEach(({id, name, local_score, stars, completion_day_level}) => {
    members.set(id, {id, name, local_score, stars});
    const a = new Map(Object.entries(completion_day_level).map(
        ([day, stars]) => Object.entries(stars).map(
            ([star, {get_star_ts}]) => [`${day}-${star}`, get_star_ts])).flat());
    [...a.entries()].forEach(([key, time]) => {
        starKeyToMemberTime.has(key) || starKeyToMemberTime.set(key, new Map());
        starKeyToMemberTime.get(key).set(id, time);
    })
});
const starwise = [...starKeyToMemberTime.keys()].sort((a,b)=>{
    const [a0,a1]=a.split("-")
    const [b0,b1]=b.split("-")
    return Math.sign(a0==b0?a1-b1:a0-b0);
}).map(key => {
    const memberTime = starKeyToMemberTime.get(key);
    const sortedMember = [...memberTime.entries()].sort((a, b) => Math.sign(a[1] - b[1])).map(x => x[0]);
    const membersscores = Object.fromEntries([...members.values()].map(m => [m.name, memberTime.has(m.id) ? members.size - sortedMember.indexOf(m.id) : 0]));
    return {key, ...membersscores};
})

console.table([...members.values()].sort((a, b) => -Math.sign(a.local_score - b.local_score)));
console.table(starwise);


