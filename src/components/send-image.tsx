import { useCodeBlock, useImage, useLoaders, useOuputBlock } from "@/store";
import { PercentCrop } from "react-image-crop";
import { getStatusUpdateUrl, getUpdateFromHE } from "@/actions";
import { LangType, runCommands } from "@/types";
import { CodeSnapError, CodeSnapErrorName } from "@/server/error";
import { logTime } from "@/utils";
// @ts-ignore
import { toast } from "sonner";
export function SendImageToServer() {
  const { imageData, cropData, setShowCropper } = useImage((s) => ({
    imageData: s.image,
    cropData: s.crop,
    setShowCropper: s.handleCropper,
  }));
  const { code, setCode, setLang } = useCodeBlock((s) => ({
    code: s.code,
    setCode: s.setCode,
    setLang: s.setLang,
  }));
  const setLoading = useLoaders((s) => s.setLoading);
  const { setOutput, setOutputCommand } = useOuputBlock((s) => ({
    setOutput: s.setOuput,
    setOutputCommand: s.setOuputCommand,
  }));
  async function poll(statusUrl: string) {
    const status = await getUpdateFromHE(statusUrl);
    logTime("polled");
    if (status === "continue-polling") {
      setTimeout(() => poll(statusUrl), 300);
      return;
    } else {
      setOutput(`${status.content}`);
    }
  }

  async function handler() {
    if (!imageData) return;
    setShowCropper(false);
    try {
      setCode("");
      setLoading("// Extracting code from snippet....");
      setOutputCommand("");
      setOutput("");
      const { lang, statusUrl } = await requestSubmitCodeToHE(
        imageData.buffer,
        cropData,
        imageData.type,
        setLang,
        setCode
      );
      poll(statusUrl);
      const runCommand = runCommands[lang as LangType];
      for (let i = 0; i < runCommand.length; i++) {
        setTimeout(() => {
          setOutputCommand(runCommand.slice(0, i + 1));
        }, 30 * i + Math.round(Math.random() * 15));
      }
    } catch (e) {
      setCode("");
      setLoading("// Your code will appear here.");
      setOutputCommand("");
      setOutput("");
      if (e instanceof CodeSnapError) {
        const errorName = e.name as CodeSnapErrorName;
        if (errorName === "UnsupportedLang") {
          toast.error("Unsupported Language", {
            position: "top-center",
            description: "Uploaded code does not support our languages.",
          });
        } else {
          toast.error("Something went wrong", {
            position: "top-center",
            description: "Please try again later.",
          });
        }
      }
    }
  }
  return (
    <button
      onClick={handler}
      className=" hover:scale-105 transition-all absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-3xl px-8 text-xl font-semibold py-2 bg-gradient-to-r from-indigo-500 to-pink-500"
    >
      GO
    </button>
  );
}

async function requestSubmitCodeToHE(
  imgArrayBuffer: ArrayBuffer,
  crop: PercentCrop,
  type: string,
  setLang: (c: string) => void,
  setCode: (c: string) => void
) {
  const params = new URLSearchParams({
    crop: JSON.stringify(crop),
    type,
  });
  const fetchUrl = `/api/vision?${params.toString()}`;
  const res = await fetch(fetchUrl, {
    method: "POST",
    body: imgArrayBuffer,
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });
  const contentType = res.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    if (data.message && data.name)
      throw new CodeSnapError(
        data.message as string,
        data.name as CodeSnapErrorName
      );
    else throw new CodeSnapError("internal server error", "Unexpected");
  }
  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("no reader available");
  }
  const decoder = new TextDecoder();
  let codeStr = "\n\n";
  let lang = "";
  let isLangReceived = false;
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    const textChunk = decoder.decode(value, { stream: true });
    if (!isLangReceived) {
      const splitIndex = textChunk.indexOf("\n");
      if (splitIndex !== -1) {
        lang = JSON.parse(textChunk.slice(0, splitIndex)).lang;
        setLang(lang);
        codeStr += textChunk.slice(splitIndex + 1);
        isLangReceived = true;
      } else {
        lang += textChunk;
      }
    } else {
      codeStr += textChunk;
    }
    setCode(codeStr);
  }

  const statusUrl = await getStatusUpdateUrl(codeStr, lang as LangType);
  return { statusUrl, lang };
}
