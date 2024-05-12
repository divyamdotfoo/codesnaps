type HackerEarthCode =
  | "REQUEST_QUEUED"
  | "REQUEST_COMPLETED"
  | "CODE_COMPILED"
  | "REQUEST_FAILED";

export type HackerEarthReqObject = {
  source: string;
  lang: LangType;
};

export type HackerEarthRes = {
  status_update_url: string;
  request_status: {
    code: HackerEarthCode;
    message: string;
  };
};

export type HackerEarthStatus = {
  request_status: {
    code: HackerEarthCode;
    message: string;
  };
  status_update_url: string;
  result: {
    run_status: {
      output: string | null;
      status: "AC" | "MLE" | "TLE" | "NA";
      time_used: number;
      memory_used: number;
    };
    compile_status: string | null;
  };
  context: string;
  he_id: string;
};

export const languages = [
  "C",
  "CPP14",
  "CPP17",
  "CLOJURE",
  "CSHARP",
  "GO",
  "HASKELL",
  "JAVA8",
  "JAVA14",
  "JAVASCRIPT_NODE",
  "KOTLIN",
  "OBJECTIVEC",
  "PASCAL",
  "PERL",
  "PHP",
  "PYTHON",
  "PYTHON3",
  "PYTHON3_8",
  "R",
  "RUBY",
  "RUST",
  "SCALA",
  "SWIFT",
  "TYPESCRIPT",
] as const;

export type LangType = (typeof languages)[number];
