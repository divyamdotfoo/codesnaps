import { useCodeBlock, useImage } from "@/store";
import { PercentCrop } from "react-image-crop";

export function SendImageToServer() {
  const { imageData, cropData, setShowCropper } = useImage((s) => ({
    imageData: s.image,
    cropData: s.crop,
    setShowCropper: s.handleCropper,
  }));
  const { code, setCode } = useCodeBlock((s) => ({
    code: s.code,
    setCode: s.setCode,
  }));
  return (
    <button
      onClick={() => {
        if (!imageData) return;
        setShowCropper(false);
        requestSubmitCodeToHE(
          imageData.buffer,
          cropData,
          imageData.type,
          code,
          setCode
        );
      }}
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
  code: string,
  setCode: (c: string) => void
) {
  const params = new URLSearchParams({
    crop: JSON.stringify(crop),
    type,
  });
  const fetchUrl = `/api/vision?${params.toString()}`;
  console.log(fetchUrl);
  try {
    const res = await fetch(fetchUrl, {
      method: "POST",
      body: imgArrayBuffer,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    const reader = res.body?.getReader();
    if (!reader) {
      const data = await res.json();
      console.log(data);
      return;
    }
    const decoder = new TextDecoder();
    let codeStr = "\n\n";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log(codeStr);
        break;
      }
      const text = decoder.decode(value, { stream: true });
      console.log(text);
      codeStr += text;
      setCode(codeStr);
    }
  } catch (e) {
    console.log(e);
  }
}
