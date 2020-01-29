export abstract class SpeechSynthesizer {
    public abstract say(text: string): void;
    public abstract sayFile(path: string): void;
    public abstract writeToFile(text: string, file: string): void;
}
