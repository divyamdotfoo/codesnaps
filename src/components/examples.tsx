"use client";
import Image, { StaticImageData } from "next/image";
import go from "../../public/examples/go.png";
import rust from "../../public/examples/rust.png";
import java from "../../public/examples/java.png";
import cpp from "../../public/examples/cpp.png";
import node from "../../public/examples/node.png";
import python from "../../public/examples/python.png";

import { useImage } from "@/store";
import React from "react";
import { cn } from "@/utils";
export function Examples() {
  return (
    <div className=" relative">
      <div className=" w-96 h-48 rounded-3xl bg-gradient-to-b from-redGradient to-purpleGradient absolute blur-2xl opacity-40 -top-8 -rotate-6 -left-10"></div>
      <h2 className=" font-bold sm:text-3xl text-2xl py-8 brightness-150">
        Snippets : Click and play
      </h2>
      <div className=" w-full flex md:flex-row relative flex-col flex-wrap gap-4 items-center justify-center px-4 md:px-0">
        <div className="absolute  md:w-3/4 md:h-96 w-3/4 h-3/4 bg-gradient-to-b md:blur-[100px] blur-3xl opacity-60 rounded-full from-redGradient to-purpleGradient"></div>
        <Example img={go} alt="Go coding snippet" path="/examples/go.png">
          <Image
            src={"/examples/go-logo.png"}
            width={50}
            height={50}
            alt="go logo"
            className=" absolute z-30 right-4 top-4"
          />
        </Example>
        <Example img={rust} alt="Rust coding snippet" path="/examples/rust.png">
          <Image
            src={"/examples/rust-logo.png"}
            width={70}
            height={70}
            alt="go logo"
            className=" absolute z-30 right-2 top-2"
          />
        </Example>
        <Example
          img={python}
          alt="Python coding snippet"
          path="/examples/python.png"
        >
          <Image
            src={"/examples/python-logo.png"}
            width={50}
            height={50}
            alt="go logo"
            className=" absolute z-30 right-2 top-3"
          />
        </Example>
        <Example img={java} alt="java coding snippet" path="/examples/java.png">
          <Image
            src={"/examples/java-logo.png"}
            width={30}
            height={30}
            alt="go logo"
            className=" absolute z-30 right-4 top-2"
          />
        </Example>
        <Example img={cpp} alt="java coding snippet" path="/examples/cpp.png">
          <Image
            src={"/examples/cpp-logo.png"}
            width={40}
            height={40}
            alt="go logo"
            className=" absolute z-30 right-4 top-4"
          />
        </Example>
        <Example img={node} alt="java coding snippet" path="/examples/node.png">
          <Image
            src={"/examples/node-logo.png"}
            width={70}
            height={70}
            alt="go logo"
            className=" absolute z-30 right-4 top-1"
          />
        </Example>
      </div>
    </div>
  );
}

const Example = ({
  img,
  alt,
  path,
  children,
}: {
  img: StaticImageData;
  alt: string;
  path: string;
  children?: React.ReactNode;
}) => {
  const setImage = useImage((s) => s.setImage);
  const handler = async () => {
    const res = await fetch(path);
    const buff = await res.arrayBuffer();
    setImage(buff, res.type, {
      height: 100,
      unit: "%",
      width: 100,
      x: 0,
      y: 0,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className=" cursor-pointer relative flex-shrink-0"
      onClick={handler}
    >
      <Image
        src={img}
        alt={alt}
        placeholder="blur"
        className={cn(
          " w-80 h-72 rounded-[10px]  brightness-[0.9] hover:brightness-105"
        )}
      />
      {children}
    </button>
  );
};
