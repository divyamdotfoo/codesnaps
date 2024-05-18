import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const codeString = `\n
"use client";\nimport SyntaxHighlighter from "react-syntax-highlighter";\nimport { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";\nexport function CodeEditor() {\nconst codeString = use client
  import SyntaxHighlighter from "react-syntax-highlighter";
  import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
  export function CodeEditor() {
    const codeString = "(num) => num + 1";
    return (
      <SyntaxHighlighter language="javascript" style={dracula}>
        {codeString}
      </SyntaxHighlighter>
    );
  };
  return (
    <div className=" xl:w-1/2">
      <SyntaxHighlighter language="javascript" style={dracula}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}`;
