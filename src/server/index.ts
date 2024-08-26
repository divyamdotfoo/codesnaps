import vision from "@google-cloud/vision";
import OpenAi from "openai";
import { PercentCrop } from "react-image-crop";
import sharp from "sharp";
import { CodeSnapError } from "./error";

const openai = new OpenAi({
  apiKey: process.env.OPENAI_KEY,
});

const client = new vision.ImageAnnotatorClient({
  projectId: process.env.PROJECT_ID,
  credentials: {
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDgqKftciQngfzb\ntDbNskktoSpqzCrKjEa1vmlRS20wsOuQygoraj4UBrCB5lKqEZgwpkMow4CqdQOl\nzqUqxdoXeWT/6YGMWWagETOHNijgtpCNC8UdSEU3hiR65GivUgsksTMm7th/xfH2\nUuFlnEode4o1i8Wcr7aRx/sa3kr7S2wtGcCKem+xSMY0TxjVz0oHiC2VAnEn7tO5\n7DPp1VuD1RVL1llE9sggMT8x7RZLPoJiVH6HaWjJQ7ey5TQxjXsPSsZKAbmZeU7W\nWz+XcT15tly5ck6kMLLJSDwWscctfs2WUYGzx0rUDi4Av+IT/Q+pIcolgRlVIOJr\nl48z+jGjAgMBAAECggEAB8HrIojZdL/JUnDTn6CzZC73fv6Tz7CuVGJB0rvPBmpl\nh/diCIO/pwNgHuwsGJFI9w0Wrpapn7kwqg4LqAFy+XKIqUmP3p/LqmVNqTKWkMPd\nE/G/GbbAJR2trsyqTLuBhP/Va1e+BBN6um28OLz/1irI5/ZumW172WbVZeUdI7Yz\ncTM85NIF1/M5brvdSJFjHUGCz4aTCL85w2FVM/b7XWGwyt0dlcoEr5T4ny+9ZvcS\nVqIZy0HgNEoNnQdDVhO2vN0e++lURx1QJK3SGdT1G2qpZX32SRWcPMXh1J0erpzz\nYuIW9N0VQ1YwPBjzorSGoilbk0lqzls6209ZqjD6UQKBgQD3NStyIwj6y4XUpf4Q\nJqr/OkhGvSVq3FBLPg/8zT4nh9dicuSUa9beSM+Dj6OUNlFOq4XETFGP/lci6Hxv\nkWNmAivKFNPlaGctYjW+gnlpR6ROVZWGsDFLbJVXp4fMRxQ/cE08mJ0tnw+ind3E\n5Wt5Qh6HV5jEkfWiaAc/9oamewKBgQDopi2lKem+4j85SAhn/7kzFgfl0inivPC3\neZY9EtdOo/lhVdgJ+lCdwQWgd19GRb4bpuujkMP4OPb/6Pd9UaaKLrwhwuNfK8ze\nmSRl27h8e2axuVf/mt4b3WurQBwlPRxi9DAuJa46kmJBXucfJNJeje2vGrg+KcS8\nRrxuSbWM+QKBgDy36YjqRA1dqex2LPYImV2BEjmVwbgCjxI8Fy8vtkF9YxDCSZSO\n/EKyvY2B3VrNEKFzDbMOT8Y/YWWols/MdQ6cH+dNwFILl7QU+EBnyaxrNVcsPELN\nyf3NmMzj0D4Dg1yll8L3dTu8Ytm9TrhK5V/uNpNll5dIhn2ycX1rbt07AoGAVUWb\nk18SasGYdNFfK2dCpWPczzLB4XZpMIajN41xV0SowjFptvaFl9zIyDEYvbQQYyhC\nVDhaa9/NQK1OESPdS+anVCSPnDF8rNYqzh7DtvSwBlIt2+USpdn5fdJIvqlwfyCL\njE6JVrSSyO0U/4hKhxe0V6sOftJmZq/ynuXrYlkCgYBZFUcpjKpQgtcaieiFDbrV\nlHG8Ga2kgbZpVaJ5L58fI0K5QUaoJq1FxDbvXZMfpkTqfcKl84HGP+X22PbGn+YP\nZkYArZ41EpvSL6kOjkHKcozMPYT7WwsK3U1XiS6rpZZG1nWCyk6CDGaBpt2RhoMP\nIZdcpmS1x2ybnWf7jcWC7Q==\n-----END PRIVATE KEY-----\n",
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    universe_domain: "googleapis.com",
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
