import vision from "@google-cloud/vision";
import OpenAi from "openai";
import { PercentCrop } from "react-image-crop";
import sharp from "sharp";
import { CodeSnapError } from "./error";

const openai = new OpenAi({
  apiKey: process.env.OPENAI_KEY,
});

const client = new vision.ImageAnnotatorClient({
  credentials: {
    client_id: process.env.CLIENT_ID,
    client_email: process.env.CLIENT_EMAIL,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyXbsjs3E0kEvv\nu6JZEnaNvJFpvsM6k/eemcN2syA6TDb4+N42FLk6TMlTTWg4TPBDXD0H0rxlztvU\n7y5NWJHilmYowWMv9fSyIm4UA3r34jHVUgWjcFe07I6lFDMWcFf/NKmyeJlKQYAs\niL9WhS44ufCl9xEZsibj6kVCkzqHcdlUhh3InGKdfsX9EjIyD0ytQ1FNxYdidKDD\nHm9+s+7w8JUidFCZHGhPXSTIRruuSMWimQUE4TncRIL9Dq+NA1n21nXTrjInlEaA\nbw/1TcfmEC6xZON1VvTwR7dBweRFmMUp4hDvdtxZZpc741biiTD0XmlETZlo60Tj\nCo8Lv2+PAgMBAAECggEAIBxkwPggpMRnj1i50QxUYI72pNFth0G1Pg3TlS6JWkV3\nThpLsvPHJvpE8mTIov4i8RWNfTeQqEl15R9MOCt+VAsciDDMoQlIDLvLEnpP7ImB\nzDQwhKyIda9yvMBmtB70kKLT/Cfe/PHO1/WkcLiYSikbbF2O7A/ZFYYLAwHLcy+b\nd4c70JPjpA+UexVQpenz7kRgBRWuulXG9RLQ4Fz4cMviJNHVMb28E5fJahAbbScs\n2j4pXerdNOArIo1Lq5E8wRiHSmkyN66ho3N+EtEXbVabswHi7trPB6uPexqE289e\nv8fmLdQkjioC+ZNdazAAkzNbHBvRODrP4wrpIChmHQKBgQD6T4MQMolvXJHglEyZ\nP+pedyAWHAX6S+RVNDJCOxz1rFKhTKV4HAlbbaeaXUrlOUalsthLTTIjX4QssUVY\nQBHD1IuFRZLLj4+eOQZSFpTSQMeLlgOUBsYV1rdEjr3q8/r4W5BAeX8Q4tNMqaiw\nZpjFq0OE8QkerWUg0pSBj3cM/QKBgQC2a5gb0CpFPUZ+6rDs5mobJ0dn5zvqWCfW\nEZG1noGd2ZYREYJ4NBtPa9x3VotIAZXXpwsq9LmvOQ6qW+B3RmoqD7wuqn+sfBMq\nhz2pEOqex9CYDKrP/EHfbQAtS7O50wQwp8U8ZtwAqMK4Kg0bZqI8lng3u10ZYofB\nPAuZqWyaewKBgQDcVwXOSk5E4z3ebW0IMgVDZqWuELkKXaf/gNUFDDgv4qNSLcAy\n/KsX+mzhK2J0aXjQ/5/6mVebX8df+CRMzQlWU1EF3fqciiEobJYtyIb0leWR8Fny\nAgx4yOvGw8hWfLLd0OwodUrvOFw8TdSag5XT2zCyY+NdR9GPlQ75BasMmQKBgDgQ\njWlO6w7orDfpjYLhtg6uXcXTTZjSizvBnpTBKHkJHJQWW5DyAsrADbwnvxrcUd87\nmbUUDdWKpbU6E5zU6WAQAfgdsquiXomdkxfY+SLfqn5wtjbCAsTWTU2ejJg6AHmr\ntnS/8DHLrDzJv8mCG66fWEdYsF5S6AI9oBsT9SrtAoGBAO+sp+wMGH/8WfFrmdcB\ntjP3KUwBkPHfGqbpQhEjZ+x73VYScEUyURoErcqJHitEGLC/ekgm1mR5t8nW/hB2\nMJZBToHMVVGDT7kCMu11WhN4ZDwo0l/wdHPw+f4/V6nS90YY3yN87gw36gDFtVFV\n4ZKqTyn7/nSzs4DsYfzBBbeV\n-----END PRIVATE KEY-----\n",
  },
});

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
