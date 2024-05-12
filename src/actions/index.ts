"use server";
import { HackerEarthStatus } from "@/types";

export async function getUpdateFromHE(statusUrl: string): Promise<
  | {
      type: "error" | "output";
      content: string;
    }
  | "continue-polling"
> {
  const res = await fetch(statusUrl, {
    headers: { "client-secret": process.env.HACKER_EARTH_SECRET! },
  });
  const status: HackerEarthStatus = await res.json();
  if (
    status.result.compile_status !== null &&
    status.result.compile_status !== "OK"
  ) {
    return {
      type: "error",
      content: status.result.compile_status,
    };
  }

  if (status.result.run_status.status === "AC") {
    const outputUrl = status.result.run_status.output;
    if (outputUrl) {
      const res = await fetch(outputUrl);
      const content = await res.text();
      return { type: "output", content };
    } else {
      return {
        type: "error",
        content: "No ouput file is present in the response of HE apit",
      };
    }
  }
  if (status.result.run_status.status === "MLE")
    return {
      type: "error",
      content: "Memory limit exceeded",
    };

  if (status.result.run_status.status === "TLE")
    return { type: "error", content: "Time limit exceeded" };

  return "continue-polling";
}
