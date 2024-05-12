import {
  HackerEarthReqObject,
  HackerEarthRes,
  LangType,
  languages,
} from "@/types";
import { logTime } from "@/utils";
import vision from "@google-cloud/vision";
import OpenAi from "openai";

const openai = new OpenAi({
  apiKey: process.env.OPENAI_KEY,
});

const client = new vision.ImageAnnotatorClient({
  projectId: process.env.PROJECT_ID,
  credentials: {
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    universe_domain: "googleapis.com",
  },
});

// for client

export async function submitCodeToHE(imgArrayBuffer: ArrayBuffer) {
  logTime("recieved buffer on server at");
  const convertedBuff = Buffer.from(imgArrayBuffer);
  const uncleanedSnippet = await getTextFromVisionApi(convertedBuff);
  logTime("uncleaned snippet at");
  if (!uncleanedSnippet) {
    // error message
    return;
  }
  const programmingL = await getLanguageWithAi(uncleanedSnippet);
  logTime("language at");
  if (
    !programmingL ||
    programmingL == "FALSE" ||
    programmingL == "false" ||
    programmingL == "0" ||
    // @ts-ignore
    languages.includes(programmingL) === false
  ) {
    // do something else here
    return;
  }
  const cleanSnippet = await getCleanSnippet(uncleanedSnippet, programmingL);
  logTime("clean snippet at");
  if (!cleanSnippet) return;
  const statusUrl = await getStatusUpdateUrl(
    cleanSnippet,
    programmingL as LangType
  );
  logTime("status url generated at");
  if (!statusUrl) {
    return;
  }
  return statusUrl;
}

async function getTextFromVisionApi(imgBuffer: Buffer) {
  const [result] = await client.textDetection(imgBuffer);
  const detections = result.textAnnotations;
  if (detections) {
    const snippetFromVision = detections[0].description;
    if (snippetFromVision !== null && snippetFromVision !== undefined) {
      return snippetFromVision;
    }
  }
  return null;
}

async function getCleanSnippet(snippet: string, pl: string) {
  const completions = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `This task demands precision. Correct any errors in the code snippet provided, ensuring it exactly matches the logic and order of the original code from the handwritten text image using Google Cloud. THE OUTPUT SHOULD CONTAIN ONLY THE CORRECTED CODE AND NOTHING ELSE.DONT INCLUDE language markers like \`\`\` or language code like cpp,javascript. ANY DEVIATION OR ADDITIONAL CONTENT will compromise the integrity of user validations. The programming language is ${pl}`,
      },
      {
        role: "system",
        content: `Snippet:${snippet}`,
      },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0,
  });
  console.log(completions.choices[0].message.content);
  return completions.choices[0].message.content;
}

async function getLanguageWithAi(snippet: string) {
  const completions = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Analyze the provided code snippet and make an educated guess on its coding language, even if the snippet is distorted or not entirely correct. If the snippet appears to match one of the following languages:\n\nC, CPP14, CPP17, CLOJURE, CSHARP, GO, HASKELL, JAVA8, JAVA14, JAVASCRIPT_NODE, KOTLIN, OBJECTIVEC, PASCAL, PERL, PHP, PYTHON, PYTHON3, PYTHON3_8, R, RUBY, RUST, SCALA, SWIFT, TYPESCRIPT\n\nReturn ONLY the name of the programming language in the given format AND DONT INCLUDE ANY OTHER TEXT (e.g., 'CPP14') if it matches any language. If the snippet does not seem to be code or does not match any of the listed languages, return 'FALSE'. ",
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
  if (completions.choices[0].message.content) {
    console.log(completions.choices[0].message.content.trim());
    return completions.choices[0].message.content.trim();
  }
  return null;
}

async function getStatusUpdateUrl(snippet: string, programmingL: LangType) {
  const reqBody: HackerEarthReqObject = {
    lang: programmingL,
    source: snippet,
  };
  const res = await fetch(process.env.HACKER_EARTH_URL!, {
    headers: {
      "Content-Type": "application/json",
      "client-secret": process.env.HACKER_EARTH_SECRET!,
    },
    method: "POST",
    body: JSON.stringify(reqBody),
  });
  if (!res) return null;
  const data: HackerEarthRes = await res.json();
  if (!data.request_status || !data.status_update_url) {
    return null;
  }
  return data.status_update_url;
}
