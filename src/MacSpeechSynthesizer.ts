import * as cp from "child_process";

export class MacSpeechSynthesizer {
    public say(text: string): void {
        cp.spawnSync("say", [text]);
    }

    public sayFile(path: string): void {
        cp.spawnSync("say", ["-f", path]);
    }

    public writeToFile(text: string, file: string): void {
        cp.spawnSync("say", ["-o", file, text]);
    }
}
