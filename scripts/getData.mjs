import {JSDOM} from "jsdom";
import 'dotenv/config';
import process from "node:process";

async function getResponse(url){
    const token = process.env.SESSION_TOKEN;
    if (!token){
        console.error(`Could not fetch ${url}. Token Missing.`)
        return ""
    }
    const response = await fetch(url, {
        headers: {
            Cookie: `session=${token}`
        }
    })
    if (!response.ok){
        console.error(`Could not fetch ${url}. Error in response. ${response.status} - ${response.statusText}`);
        return null
    }
    return response;
}

export async function getText(url) {
    const response = await getResponse(url);
    if (response) {
        return await response.text();
    }
    return "";
}

export async function getJson(url){
    const response = await getResponse(url);
    if (response) {
        return await response.json();
    }
    return {};
}
export async function getExample(url) {
    const html = await getText(url);
    const {document} = (new JSDOM(html)).window;
    return [...document.querySelectorAll("pre>code")].filter(x=>(x.parentElement?.previousElementSibling?.textContent ?? "").endsWith("example:"))[0]?.textContent ?? "";
}