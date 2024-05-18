export class CodeSnapError extends Error {
  constructor(message: string, errName: CodeSnapErrorName) {
    super(message);
    this.name = errName;
  }
}

export type CodeSnapErrorName =
  | "VisionApiFailure"
  | "NoTextExtractions"
  | "OpenAiApiFailure"
  | "OpenAiNoRes"
  | "UnsupportedLang"
  | "HackerEarthApiFail"
  | "Unexpected";
