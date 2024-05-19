import {
  getCroppedImage,
  getLanguageWithAi,
  getTextFromVisionApi,
} from "@/server";
import type { PercentCrop } from "react-image-crop";
import { languages as validLanguages } from "@/types";
import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText } from "ai";
import { CodeSnapError } from "@/server/error";

export async function POST(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const cropData: PercentCrop = JSON.parse(params.get("crop") || "");
    const data = await req.arrayBuffer();
    const croppedImage = await getCroppedImage(data, cropData);

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
    const encoder = new TextEncoder();
    const combinedStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(JSON.stringify({ lang: codingLanguage }) + "\n")
        );

        const openaiReader = result.textStream.getReader();
        while (true) {
          const { done, value } = await openaiReader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      },
    });

    return new StreamingTextResponse(combinedStream);
  } catch (e) {
    console.log(e);
    if (e instanceof CodeSnapError)
      return Response.json(
        { name: e.name, message: e.message },
        { status: 500 }
      );
    return Response.json({ message: "internal server error" }, { status: 500 });
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
    throw new CodeSnapError("invalid programming language", "UnsupportedLang");
  }
};
