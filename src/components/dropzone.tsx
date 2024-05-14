"use client";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import { useEffect } from "react";
import { useImage } from "@/store";
export function MyDropzone() {
  const setImage = useImage((s) => s.setImage);
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    accept: { "image/*": [] },
  });
  useEffect(() => {
    if (acceptedFiles[0]) {
      console.log(acceptedFiles[0]);
      acceptedFiles[0].arrayBuffer().then((b) => {
        if (b) {
          setImage(b, acceptedFiles[0].type, {
            height: 0,
            width: 0,
            unit: "px",
            x: 0,
            y: 0,
          });
        }
      });
    }
  }, [acceptedFiles]);
  return (
    <div className=" w-1/2 mx-auto h-12 my-4">
      <div
        {...getRootProps({ isFocused, isDragAccept, isDragReject })}
        className=" cursor-pointer w-full h-full border-[1px] rounded-md border-white border-dashed flex items-center justify-center"
        // style={{
        //   borderImage:
        //     "linear-gradient(to right, rgb(99,102,241), rgb(236, 72, 153)) 1",
        //   borderWidth: "2px",
        // }}
      >
        <input {...getInputProps()} />
        <p className=" font-medium opacity-80 tracking-wider">
          Drop your code snippet
          <span className=" px-1">
            <ImagePlus
              className=" inline w-4 h-4 font-medium"
              strokeWidth={2}
            />
          </span>
          here
        </p>
      </div>
    </div>
  );
}
