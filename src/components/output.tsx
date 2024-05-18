"use client";
import { useOuputBlock } from "@/store";

export function OutputBlock() {
  const { output, outputCommand, setOutput } = useOuputBlock((s) => ({
    output: s.output,
    outputCommand: s.outputCommand,
    setOutput: s.setOuputCommand,
  }));

  return (
    <div
      className=" lg:basis-1/2 w-full min-h-[205px] max-h-[400px] overflow-auto rounded-[6px] px-4 py-3 bg-black scrollContainer "
      style={{
        // border: "2px solid #673ab7",
        boxShadow: "0 0 5px 2px rgba(103, 58, 183, 0.5)",
      }}
    >
      <div
        className=" pb-4"
        style={{
          opacity: outputCommand.length ? "1" : "0.5",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="54"
          height="14"
          viewBox="0 0 54 14"
          className=""
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
      <div className="">
        <p className=" inline font-medium text-lime-500">
          @codesnap <span className=" text-pink-500 ">➔</span>
        </p>
        <p className=" inline pl-2 opacity-80 text-wrap">
          {outputCommand}
          <span className=" bg-purple-500 text-purple-500 mx-1">|</span>
        </p>
      </div>
      <pre className=" pt-1">
        {typeof output === "string" ? output : output.content}
      </pre>
    </div>
  );
}
