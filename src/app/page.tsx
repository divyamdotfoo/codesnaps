"use client";
import { getUpdateFromHE } from "@/actions";
import { logTime } from "@/utils";
import { useState } from "react";

export default function Page() {
  const [imgArrayBuffer, setBuffer] = useState<ArrayBuffer | null>(null);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState("");

  const handleImageUpload = async () => {
    setLoading("");
    setOutput("");
    if (!imgArrayBuffer) return;
    logTime("sent buffer from client");
    setLoading("Extracting...");
    const statusUrl = await requestSubmitCodeToHE(imgArrayBuffer);
    if (!statusUrl) return;
    setLoading("Compiling...");
    poll(
      statusUrl,
      (b) => setLoading(b),
      (o) => setOutput(o)
    );
  };

  return (
    <div>
      <h1 className=" text-5xl p-4 font-semibold">CodeSnap</h1>
      <input
        className="block md:inline"
        type="file"
        onChange={(e) => {
          const file = e.target.files;
          if (file) {
            file[0].arrayBuffer().then((b) => {
              setBuffer(b);
            });
          }
        }}
      />
      <button
        onClick={handleImageUpload}
        className="border my-4 md:my-0 border-white px-4 py-2 rounded-md bg-purple-600"
      >
        {loading.trim() ? loading : "Get output"}
      </button>
      <div className=" my-4">
        <p>Ouput will be displayed here</p>
        <pre className=" p-4 border h-96 w-80 border-white">{output}</pre>
      </div>
    </div>
  );
}

async function requestSubmitCodeToHE(imgArrayBuffer: ArrayBuffer) {
  const res = await fetch("/api/vision", {
    method: "POST",
    body: imgArrayBuffer,
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
  const data = await res.json();
  logTime("status url recived at");
  return data.statusUrl as string;
}

async function poll(
  pollUrl: string,
  setLoading: (b: string) => void,
  setOutput: (o: string) => void
) {
  const status = await getUpdateFromHE(pollUrl);
  logTime("polled");
  if (status === "continue-polling") {
    setTimeout(() => poll(pollUrl, setLoading, setOutput), 300);
    return;
  } else {
    setLoading("");
    setOutput(`${status.type}:\n${status.content}`);
    console.log(status);
  }
}
