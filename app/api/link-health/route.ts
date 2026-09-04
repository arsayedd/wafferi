import { NextResponse } from "next/server";
import { probeListingUrl } from "@/lib/link-health";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url).searchParams.get("u") ?? "";
  const health = await probeListingUrl(url);
  return NextResponse.json(health, {
    headers: { "cache-control": "private, max-age=120" },
  });
}
