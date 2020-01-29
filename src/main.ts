import { SpeechSynthesizer } from "./SpeechSynthesizer";
import { WindowsSpeechSynthesizer } from "./WindowsSpeechSynthesizer";
import { MacSpeechSynthesizer } from "./MacSpeechSynthesizer";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const innertext = require("innertext");

const SEARCH_TRANSLATION_REGEX = /<a\s+class\s*=\s*"go trans"\s+href="([^"]+)"/;
const SEARCH_ORIGINAL_REGEX = /<a\s+class\s*=\s*"topHitLink"\s+href="([^"]+)"/;
const TITLE_REGEX = /<h1>\s*<span>([^<]*).+?(?=<span class="sub">)(.+?)(?=<\/span>)/s;
const LYRICS_REGEX = /<div id="lyrics">(.*?)<div class="brightLink/s;

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
    const lyricsUrl =
        "https://www.songtexte.com/" +
        (SEARCH_TRANSLATION_REGEX.exec(searchHtml)?.[1] ??
            SEARCH_ORIGINAL_REGEX.exec(searchHtml)?.[1]);

    const lyricsResponse = await fetch(lyricsUrl);
    const lyricsHtml = await lyricsResponse.text();
    const titleMatch = TITLE_REGEX.exec(lyricsHtml);
    const title =
        (titleMatch
            ? titleMatch?.[1] +
              ", " +
              (titleMatch?.[2] ? innertext(titleMatch[2]) : "")
            : "Kein Titel gefunden uuuuuuuuuuuuuuuuuuuu") + ";";

    const lyricsMatch = LYRICS_REGEX.exec(lyricsHtml);
    const lyrics = lyricsMatch?.[0]
        ? innertext(lyricsMatch[0] + '">')
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
