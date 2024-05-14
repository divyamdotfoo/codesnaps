import type { PixelCrop } from "react-image-crop";
import { create } from "zustand";

type ImageUploadStore = {
  image: {
    buffer: ArrayBuffer;
    type: string;
    crop: PixelCrop;
  } | null;
  setImage: (imageBuff: ArrayBuffer, type: string, crop: PixelCrop) => void;
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
  setImage: (img, imgType, crop) => {
    const imageBlob = new Blob([img], { type: imgType });
    const blobUrl = URL.createObjectURL(imageBlob);
    console.log(blobUrl);
    set({
      image: {
        buffer: img,
        type: imgType,
        crop,
      },
      imageBlobUrl: blobUrl,
    });
  },
  cropper: true,
  handleCropper: (b) => set({ cropper: b }),
}));

export const useCodeBlock = create<CodeBlock>((set) => ({
  code: "",
  setCode: (c) => set({ code: c }),
}));

export const useOuputBlock = create<OutputBlock>((set) => ({
  output: null,
  setOuput: (o) => set({ output: o }),
}));
