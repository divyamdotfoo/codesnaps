import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const logTime = (msg: string) =>
  console.log(msg, new Date(Date.now()).getSeconds());
