import type { PercentCrop } from "react-image-crop";
import { create } from "zustand";

type ImageUploadStore = {
  image: {
    buffer: ArrayBuffer;
    type: string;
  } | null;
  crop: PercentCrop;
  setCrop: (c: PercentCrop) => void;
  setImage: (imageBuff: ArrayBuffer, type: string, crop: PercentCrop) => void;
  imageBlobUrl: string | null;
  cropper: boolean;
  handleCropper: (b: boolean) => void;
};

type CodeBlock = {
  code: string;
  setCode: (c: string) => void;
  lang: string;
  setLang: (c: string) => void;
};

type OutputBlock = {
  output:
    | {
        type: "output" | "error";
        content: string;
      }
    | string;
  setOuput: (o: { type: "output" | "error"; content: string } | string) => void;
  outputCommand: string;
  setOuputCommand: (c: string) => void;
};

type Loaders = {
  loading: string | null;
  setLoading: (loadText: string) => void;
};

export const useImage = create<ImageUploadStore>((set) => ({
  image: null,
  imageBlobUrl: null,
  setImage: (img, imgType) => {
    const imageBlob = new Blob([img], { type: imgType });
    const blobUrl = URL.createObjectURL(imageBlob);
    set({
      image: {
        buffer: img,
        type: imgType,
      },
      imageBlobUrl: blobUrl,
      cropper: true,
    });
  },
  cropper: false,
  handleCropper: (b) => set({ cropper: b }),
  crop: { x: 0, y: 0, height: 100, unit: "%", width: 100 },
  setCrop: (c) => set({ crop: c }),
}));

export const useCodeBlock = create<CodeBlock>((set) => ({
  code: "",
  setCode: (c) => set({ code: c }),
  lang: "",
  setLang: (c) =>
    set({ lang: c.replaceAll(/\d/g, "").replace(/_.*/, "").toLowerCase() }),
}));

export const useLoaders = create<Loaders>((set) => ({
  loading: "// Your code will appear here.",
  setLoading: (text) => {
    for (let i = 0; i < text.length; i++) {
      setTimeout(() => set({ loading: text.slice(0, i) }), i * 50);
    }
  },
}));

export const useOuputBlock = create<OutputBlock>((set) => ({
  output: "",
  setOuput: (c) => set({ output: c }),
  outputCommand: "",
  setOuputCommand: (c) => set((s) => ({ outputCommand: c })),
}));
