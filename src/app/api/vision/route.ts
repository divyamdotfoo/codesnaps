import {
  getCroppedImage,
  getLanguageWithAi,
  getTextFromVisionApi,
} from "@/server";
import type { PercentCrop } from "react-image-crop";
import { languages as validLanguages } from "@/types";
import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText } from "ai";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const imgType = params.get("type");
    const cropData: PercentCrop = JSON.parse(params.get("crop") || "");
    console.log(imgType, cropData);
    const data = await req.arrayBuffer();
    fs.writeFile("orignal.jpg", Buffer.from(data), "binary", (err) => {});
    const croppedImage = await getCroppedImage(data, cropData);
    fs.writeFile("cropped.jpg", croppedImage, "binary", (err) => {});

    const visionText = await getTextFromVisionApi(croppedImage);
    const codingLanguage = await getLanguageWithAi(visionText);
    isValidLanguage(codingLanguage);
    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: `This task demands precision. Correct any errors in the code snippet provided, ensuring it exactly matches the logic and order of the original code from the handwritten text image using Google Cloud. THE OUTPUT SHOULD CONTAIN ONLY THE CORRECTED CODE AND NOTHING ELSE.DONT INCLUDE language markers like \`\`\` or language code like cpp,javascript. ANY DEVIATION OR ADDITIONAL CONTENT will compromise the integrity of user validations. The programming language is ${codingLanguage}`,
        },
        {
          role: "system",
          content: `Snippet:${visionText}`,
        },
      ],
    });
    return new StreamingTextResponse(result.textStream);
  } catch (e) {
    console.log(e);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

const isValidLanguage = (openaiRes: string) => {
  if (
    !openaiRes ||
    openaiRes == "FALSE" ||
    openaiRes == "false" ||
    openaiRes == "0" ||
    // @ts-ignore
    validLanguages.includes(openaiRes) === false
  ) {
    throw new Error("invalid programming language");
  }
};
