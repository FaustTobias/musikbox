import * as cp from "child_process";

export class WindowsSpeechSynthesizer {
    public say(text: string): void {
        cp.spawnSync("PowerShell", [
            "-Command",
            `Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak(${escape(
                text,
            )})`,
        ]);
    }

    public sayFile(path: string): void {
        cp.spawnSync("PowerShell", [
            "-Command",
            `Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak((Get-Content -Path ${escape(
                path,
            )}))`,
        ]);
    }

    public writeToFile(text: string, file: string): void {
        cp.spawnSync("PowerShell", [
            "-Command",
            `Add - Type - AssemblyName System.Speech; $speech = (New - Object System.Speech.Synthesis.SpeechSynthesizer); $speech.SetOutputToWaveFile(${escape(
                file,
            )}); $speech.Speak(${escape(text)})`,
        ]);
    }
}

function escape(text: string): string {
    let result = "'";

    for (const c of text) {
        if (c === "'") {
            result += "\\";
        } else if (c === '"') {
            result += "\\";
        }

        result += c;
    }

    result += "'";

    return result;
}
