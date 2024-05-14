"use client";
import { useImage } from "@/store";
import { useState } from "react";
import ReactCropper, { PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog } from "./ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
export function ImageCropper() {
  const [crop, setCrop] = useState<PixelCrop>();
  const { blobUrl, cropper, handleCropper } = useImage((s) => ({
    setImage: s.setImage,
    blobUrl: s.imageBlobUrl,
    imageState: s.image,
    cropper: s.cropper,
    handleCropper: s.handleCropper,
  }));
  // if (!blobUrl) return;

  return (
    <Dialog open={cropper} onOpenChange={handleCropper}>
      <DialogContent>
        {/* <ReactCropper
          crop={crop}
          onChange={(c) => {
            setCrop(c);
          }}
        >
          <img src={blobUrl} alt="" />
        </ReactCropper> */}
        <p>hello</p>
        <p>hello</p>
        <p>hello</p>
        <p>hello</p>
        <p>hello</p>
        <p>hello</p>
        <p>hello</p>
      </DialogContent>
    </Dialog>
  );
}
