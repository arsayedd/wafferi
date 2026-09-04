import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import path from "node:path";
import { productGlyphSvg } from "@/lib/item-glyph";
import { uniquePhotoSrc } from "@/lib/unique-photos";
import type { CategoryId } from "@/lib/types";

function publicUrl(req: Request, pathname: string) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host && !host.startsWith("0.0.0.0")) {
    const proto = req.headers.get("x-forwarded-proto") || "http";
    return `${proto}://${host}${pathname}`;
  }
  return `http://127.0.0.1:43147${pathname}`;
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id") ?? "";
  const name = u.searchParams.get("name") ?? "";
  const category = (u.searchParams.get("category") ?? "accessories") as CategoryId;

  const unique = uniquePhotoSrc(id);
  if (unique) {
    const file = path.join(process.cwd(), "public", unique.replace(/^\//, ""));
    if (existsSync(file)) return NextResponse.redirect(publicUrl(req, unique), 302);
  }

  const svg = productGlyphSvg({ id, name, category });
  return new NextResponse(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}
