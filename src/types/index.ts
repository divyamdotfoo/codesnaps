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

export const runCommands = {
  C: "gcc codesnap.c -o codesnap && ./codesnap",
  CPP14: "g++ -std=c++14 codesnap.cpp -o codesnap && ./codesnap",
  CPP17: "g++ -std=c++17 codesnap.cpp -o codesnap && ./codesnap",
  CLOJURE: "clojure codesnap.clj",
  CSHARP: "csc codesnap.cs && mono codesnap.exe",
  GO: "go run codesnap.go",
  HASKELL: "runhaskell codesnap.hs",
  JAVA8: "javac codesnap.java && java codesnap",
  JAVA14: "javac codesnap.java && java codesnap",
  JAVASCRIPT_NODE: "node codesnap.js",
  KOTLIN:
    "kotlinc codesnap.kt -include-runtime -d codesnap.jar && java -jar codesnap.jar",
  OBJECTIVEC: "gcc -framework Cocoa codesnap.m -o codesnap && ./codesnap",
  PASCAL: "fpc codesnap.pas && ./codesnap",
  PERL: "perl codesnap.pl",
  PHP: "php codesnap.php",
  PYTHON: "python2 codesnap.py",
  PYTHON3: "python3 codesnap.py",
  PYTHON3_8: "python3.8 codesnap.py",
  R: "Rscript codesnap.R",
  RUBY: "ruby codesnap.rb",
  RUST: "rustc codesnap.rs && ./codesnap",
  SCALA: "scalac codesnap.scala && scala codesnap",
  SWIFT: "swift codesnap.swift",
  TYPESCRIPT: "ts-node codesnap.ts",
} as const;

const snippets = ["go,rust"];
