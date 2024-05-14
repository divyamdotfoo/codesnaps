"use client";
import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
export function CodeEditor() {
  const codeString = `\n\n"use client";
    import SyntaxHighlighter from "react-syntax-highlighter";
    import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
    export function CodeEditor() {
      const codeString = use client
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

  const [code, setCode] = useState(codeString);
  // useEffect(() => {
  //   for (let i = 0; i < codeString.length; i++) {
  //     setTimeout(() => {
  //       setCode(codeString.slice(0, i + 1));
  //     }, 10 * i);
  //   }
  // }, []);
  return (
    <div className="xl:w-1/2 relative overflow-x-hidden bg-gradient-to-r from-indigo-500 to-pink-500 p-[2px] rounded-md">
      <Mac />
      <SyntaxHighlighter
        language="javascript"
        className="codeEditor"
        style={{
          ...nightOwl,
          hljs: {
            display: "block",
            overflowX: "auto",
            overflowY: "auto",
            padding: "0.5em",
            background: "rgb(var(--background))",
            color: "#f8f8f2",
            borderRadius: "6px",
            maxHeight: "400px",
            minHeight: "200px",
            paddingLeft: "20px",
          },
        }}
      >
        {!code.length ? "\n\n// Your code will appear here." : code}
      </SyntaxHighlighter>
    </div>
  );
}

/*

*/

function Mac() {
  return (
    <div className=" absolute top-[2px] left-1 right-2 h-10 bg-background z-40">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="54"
        height="14"
        viewBox="0 0 54 14"
        className=" absolute top-3 left-3"
      >
        <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
          <circle
            cx="6"
            cy="6"
            r="6"
            fill="#FF5F56"
            stroke="#E0443E"
            stroke-width=".5"
          ></circle>
          <circle
            cx="26"
            cy="6"
            r="6"
            fill="#FFBD2E"
            stroke="#DEA123"
            stroke-width=".5"
          ></circle>
          <circle
            cx="46"
            cy="6"
            r="6"
            fill="#27C93F"
            stroke="#1AAB29"
            stroke-width=".5"
          ></circle>
        </g>
      </svg>
    </div>
  );
}
