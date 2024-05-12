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
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBtqlutaF5hk51\nCEt04DrR4KED+rm5jbT1KnX8UZjojTnATTH0BpwXcM7WokrS0RuffXJolB0w8eSE\njLmjBSq6v8pYb6+Z/03KBjHDXZaKaoducDa08d4UW4HTEXqhzdp4OQ8Vv5fjaPRL\nMEP++GOMQ+Oc7s5pK+I5es4p9lxbGXQGZB6egVVUt/jbPHV2E0IhJTDylKFnf3Nx\nBdwu5aP/R6WFjbbtttrwZu8uKC7DA6zk15/5V03ZIuGvx0HlZNH9CeBNuxQvnPMW\nChyuZs7N4wsdlAt4JJVowy7mzeqVC76R2ilesoQeFrM3MDK5+LfqhCdkKAiXOyqb\nzl/Eqo5HAgMBAAECggEABSOkkBunSozHiEkgwChYw/IUY4FWq93e4Kg9On7E5adY\nuMmmtLiRXvlu5Pin4oe9fPg8VxqJQbl3j63jsoSaRk6wGBnycmcr3nTwNtfE419n\n82qft1VslMt7gMJUdHZJJwP6HfoX/Gai7VtWja1Auts5CGDsWGCOxZ0EwWek7Wr0\ngVybh3NQCpvGuVJgaCLoud1W6ag+x4NSFct95rq1ZOOcTk6CYGO3KAkDpZxtHtrR\ndC+uBprFdwnneSDHbaTk8+1dTotZMdpxwQM9iJ8BvYvDb+HGuM8llWdYC61CHv2s\nCH6sFNTp0HEy1s0NzRBHlmcLYRx1ObNxleuEoUzeYQKBgQDwNOLSYZN0/0TeL5pu\nbIWQ1kOx5RZ9Vxv00L1+3RsM6TKwTLcdNkkoQbjTpDSU9QYazyxXfwXU7M0P+x6n\nw5xKQB/6aBAGyNQeJh9zdeNYbrvMFaPBURjpIxe0HV96FhgRZdkJ5J1nLTHciims\nhO6VBHvMyW0pHfqklJoSEDZ5JwKBgQDOczaEjCLh80UO/rBdNoCfnP/rLwKLk8/Y\noSPZt2maImeliP3XaKS6a2W6kLLuDl8N+8PmNunwrw9ZnWrBJW5zkDmQCtKQmohI\nQlNiK4z+hzc9FK/2JDzssgRfrXS2R1s9MFFPuccZtVW6Pp0pW3idcjJv0CCMjl7M\nHjeBg8M14QKBgQCwq5Uwe0gDQ0UZzhVdpj/OuWjszLvv0EPlminlxyYAJvx7ItGD\nkMvZ6gzQzPNHo7ervDi22dwmMUzZti9j4MFw8x0SBbvT4Z3x1sRHHavq/PbvMfNR\nWh5iSsdCWGBC4UEueqRZXGZQ3rLPrGbeVp9LxxJvGq9JEJ2qswlmw7ns/QKBgAVb\nvi2AiaM9siwqdh9lO79ozsem57UBuCJSRGDxPr9uZyxHuvbtU2E3SmOmP86n9tWh\nFDuUb0v87zQPPucWdqBvPN89OKviJulhN1LT+IverJNcRxjnZeFq2Ww2T1Iv1fFn\noKSmGMHVEA2OdHvPUPkdLqvyRfX/9/vqSNyGs/lhAoGBAO/ny+W0uC4aty3vjtP8\nxAKRtMVC2y0yftgDoH1Br/WhG0gAL2mD549kLkmNXJUN5XAtNwA/gXPArnLlg3MI\nB2pcRbm6Mimp9RymcZEDHPgEminzb4uHAXtKBuO06ml6zZxAo+Cky4Wqu2YMCfYi\nKm9RRJBfeJ1FaqqtI26O6hSR\n-----END PRIVATE KEY-----\n",
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
