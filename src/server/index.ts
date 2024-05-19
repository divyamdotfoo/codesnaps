import vision from "@google-cloud/vision";
import OpenAi from "openai";
import { PercentCrop } from "react-image-crop";
import sharp from "sharp";
import { CodeSnapError } from "./error";

const openai = new OpenAi({
  apiKey: process.env.OPENAI_KEY,
});

const client = new vision.ImageAnnotatorClient();

export async function getTextFromVisionApi(imgBuffer: Buffer) {
  let res;
  try {
    res = await client.textDetection(imgBuffer);
  } catch (e) {
    console.log(e);
    throw new CodeSnapError("Seems like vision api failed", "VisionApiFailure");
  }
  const [result] = res;
  const detections = result.textAnnotations;
  if (!detections || !detections[0])
    throw new CodeSnapError("No extracted data", "NoTextExtractions");
  const snippetFromVision = detections[0].description;
  if (!snippetFromVision)
    throw new CodeSnapError("No extracted data", "NoTextExtractions");

  return snippetFromVision;
}

export async function getLanguageWithAi(snippet: string) {
  let completions;
  try {
    completions = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Analyze the provided code snippet and make an educated guess on its coding language, even if the snippet is distorted or not entirely correct. If the snippet appears to match one of the following languages:\n\nC, CPP17, CLOJURE, CSHARP, GO, HASKELL, JAVA14, JAVASCRIPT_NODE, KOTLIN, OBJECTIVEC, PASCAL, PERL, PHP, PYTHON3_8, R, RUBY, RUST, SCALA, SWIFT, TYPESCRIPT\n\nReturn ONLY the name of the programming language in the given format AND DONT INCLUDE ANY OTHER TEXT (e.g., 'CPP14') if it matches any language. If the snippet does not seem to be code or does not match any of the listed languages, return 'FALSE'. ",
        },
        {
          role: "system",
          content: `Snippet: ${snippet}`,
        },
      ],
      model: "gpt-3.5-turbo-0125",
      temperature: 0,
      max_tokens: 20,
    });
  } catch (e) {
    throw new CodeSnapError(
      "seems like openai fetch request failed",
      "OpenAiApiFailure"
    );
  }
  if (completions.choices[0].message.content) {
    return completions.choices[0].message.content.trim();
  }
  throw new CodeSnapError("no response from openai", "OpenAiNoRes");
}

export const getCroppedImage = async (
  imgBuffer: ArrayBuffer,
  cropData: PercentCrop
) => {
  const img = sharp(Buffer.from(imgBuffer));
  const { height: originalHeight, width: originalWidth } = await img.metadata();
  if (!originalHeight || !originalWidth) {
    throw new Error("internal server error");
  }
  const { height, width, x, y } = cropData;
  const sx = Math.round((x / 100) * originalWidth);
  const sy = Math.round((y / 100) * originalHeight);
  const croppedWidth = Math.round((width / 100) * originalWidth);
  const croppedHeight = Math.round((height / 100) * originalHeight);
  const croppedImg = await img
    .extract({
      top: sy,
      left: sx,
      width: croppedWidth,
      height: croppedHeight,
    })
    .toBuffer();

  return croppedImg;
};
