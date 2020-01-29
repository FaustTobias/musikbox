import { SpeechSynthesizer } from "./SpeechSynthesizer";
import { WindowsSpeechSynthesizer } from "./WindowsSpeechSynthesizer";
import { MacSpeechSynthesizer } from "./MacSpeechSynthesizer";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

async function bestMatch(
    query: string,
): Promise<{
    title: string;
    lyrics: string;
} | null> {
    const searchResponse = await fetch(
        "https://www.songtexte.com/search?c=all&q=" + encodeURIComponent(query),
        {
            headers: {
                Accept: "text, text/plain, text/xml",
                "Accept-Encoding": "UTF-8",
                "Content-Type": "text/plain; charset=utf-8;",
                "User-Agent": "me",
            },
        },
    );
    const searchHtml = await searchResponse.text();
    const searchDom = new JSDOM(searchHtml);

    const link =
        searchDom.window.document.body.querySelector(".topHit .trans") ||
        searchDom.window.document.body.querySelector(".topHitLink");
    if (!link) {
        return null;
    }
    const lyricsUrl = "https://www.songtexte.com/" + (link as any).href;
    const lyricsResponse = await fetch(lyricsUrl);
    const lyricsHtml = await lyricsResponse.text();
    const lyricsDom = new JSDOM(lyricsHtml);
    const titleElement = lyricsDom.window.document.querySelector("h1");
    const title = titleElement
        ? titleElement.textContent || "Kein Titel vorhanden"
        : "Kein Titel vorhanden";
    const lyricsElement = lyricsDom.window.document.body.querySelector(
        "#lyrics",
    );
    const lyrics = lyricsElement
        ? lyricsDom.window.document.body.querySelector("#lyrics")!.textContent!
        : "Kein Songtext vorhanden :sadface:";

    return {
        title,
        lyrics,
    };
}

export async function main(args: string[]): Promise<void> {
    if (!args[0]) {
        console.error("Please provide a song name.");
        process.exit(1);
        return;
    }

    const lyricsFile = path.join(__dirname, "..", "lyrics.txt");
    const lyrics = await bestMatch(args[0]);

    let speech: SpeechSynthesizer;
    if (process.platform === "win32") {
        speech = new WindowsSpeechSynthesizer();
    } else if (process.platform === "darwin") {
        speech = new MacSpeechSynthesizer();
    } else {
        console.error("No text to speech backend found.");
        process.exit(1);
        return;
    }

    if (lyrics === null) {
        speech.say("Oh nein, kein Lied gefunden. uuuuuuuuuuuuuuuuuuuuu");
        return;
    }

    speech.say(`Beep Boop, jetzt wird gespielt: ${lyrics.title}`);
    fs.writeFileSync(lyricsFile, lyrics.lyrics);
    speech.sayFile(lyricsFile);
}
