"use client";
import { useCodeBlock, useLoaders } from "@/store";
import { useEffect, useRef } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
export function CodeEditor() {
  const { code, lang, setCode } = useCodeBlock((s) => ({
    code: s.code,
    setCode: s.setCode,
    lang: s.lang,
  }));
  const loading = useLoaders((s) => s.loading);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editorEl = document.getElementsByClassName("codeEditor")[0];
    if (editorEl) {
      editorEl.scrollTo({
        top: editorEl.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [code]);
  return (
    <div
      className=" lg:basis-1/2 w-full relative overflow-x-hidden overflow-y-hidden bg-gradient-to-r from-indigo-500 to-pink-500 p-[2px] rounded-[6px]"
      ref={editorRef}
      style={{
        boxShadow:
          "0 10px 20px rgba(0, 0, 0, 0.3), 0 1px 10px rgba(255, 105, 180, 0.5)",
      }}
    >
      <Mac />
      <SyntaxHighlighter
        language={lang}
        className="scrollContainer codeEditor"
        startingLineNumber={-1}
        showLineNumbers
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
            paddingLeft: "15px",
          },
        }}
      >
        {!code.length ? `\n\n${loading}` : code}
      </SyntaxHighlighter>
    </div>
  );
}

/*

*/

export function Mac() {
  return (
    <div className=" absolute top-[2px] left-1 right-2 h-10 bg-background z-40">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="54"
        height="14"
        viewBox="0 0 54 14"
        className=" absolute top-3 left-3"
      >
        <g fill="none" fillRule="evenodd" transform="translate(1 1)">
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
