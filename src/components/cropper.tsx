"use client";
import { useImage } from "@/store";
import ReactCropper from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent } from "./ui/dialog";
import { SendImageToServer } from "./send-image";
export function ImageCropper() {
  const { blobUrl, cropper, crop, setCrop, setShowCropper } = useImage((s) => ({
    setImage: s.setImage,
    blobUrl: s.imageBlobUrl,
    cropper: s.cropper,
    setShowCropper: s.handleCropper,
    crop: s.crop,
    setCrop: s.setCrop,
  }));
  if (!blobUrl) return;

  return (
    <Dialog open={cropper} onOpenChange={setShowCropper}>
      <DialogContent className="p-[3px] max-h-[400px] max-w-fit min-h-fit bg-gradient-to-r border-none from-indigo-500 to bg-pink-500">
        <ReactCropper
          className=" border-none max-h-[390px] mx-auto"
          crop={crop}
          onChange={(c, pc) => {
            setCrop(pc);
          }}
        >
          <img src={blobUrl} alt="" />
        </ReactCropper>
        <SendImageToServer />
      </DialogContent>
    </Dialog>
  );
}
