import { submitCodeToHE } from "@/server";

export async function POST(req: Request) {
  const data = await req.arrayBuffer();
  const statusUrl = await submitCodeToHE(Buffer.from(data));
  return Response.json({ statusUrl }, { status: 200 });
}
