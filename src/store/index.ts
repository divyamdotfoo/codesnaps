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
};

type OutputBlock = {
  output: {
    type: "output" | "error";
    content: string;
  } | null;
  setOuput: (o: { type: "output" | "error"; content: string }) => void;
};

type Loaders = {};

export const useImage = create<ImageUploadStore>((set) => ({
  image: null,
  imageBlobUrl: null,
  setImage: (img, imgType) => {
    const imageBlob = new Blob([img], { type: imgType });
    const blobUrl = URL.createObjectURL(imageBlob);
    console.log(blobUrl);
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
  code: '\n\npublic class Hello {\n    public static void main(String[] args) {\n        System.out.println("hello there");\n    }\n}',
  setCode: (c) => set({ code: c }),
}));

export const useOuputBlock = create<OutputBlock>((set) => ({
  output: null,
  setOuput: (o) => set({ output: o }),
}));
