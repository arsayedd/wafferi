import { NextResponse } from "next/server";
import { existsSync } from "node:fs";
import path from "node:path";
import { productGlyphSvg } from "@/lib/item-glyph";
import { uniquePhotoSrc } from "@/lib/unique-photos";
import { resolveRemotePhoto } from "@/lib/remote-photo";
import { productImage, productImageFallback } from "@/lib/product-images";
import type { CategoryId } from "@/lib/types";

export const dynamic = "force-dynamic";

function publicUrl(req: Request, pathname: string) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (host && !host.startsWith("0.0.0.0")) {
    const proto = req.headers.get("x-forwarded-proto") || "http";
    return `${proto}://${host}${pathname}`;
  }
  return `http://127.0.0.1:43147${pathname}`;
}

function fileIfExists(req: Request, pathname: string) {
  if (!pathname.startsWith("/")) return "";
  const file = path.join(process.cwd(), "public", pathname.replace(/^\//, ""));
  return existsSync(file) ? publicUrl(req, pathname) : "";
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get("id") ?? "";
  const name = u.searchParams.get("name") ?? "";
  const brand = u.searchParams.get("brand") ?? "";
  const model = u.searchParams.get("model") ?? "";
  const category = (u.searchParams.get("category") ?? "accessories") as CategoryId;
  const glyphOnly = u.searchParams.get("fallback") === "glyph";

  const unique = uniquePhotoSrc(id);
  const uniqueUrl = unique ? fileIfExists(req, unique) : "";
  if (uniqueUrl) return NextResponse.redirect(uniqueUrl, 302);

  if (!glyphOnly) {
    const remote = await resolveRemotePhoto({ id, brand, name, model, category });
    if (remote) {
      if (remote.startsWith("/")) {
        const local = fileIfExists(req, remote);
        if (local) return NextResponse.redirect(local, 302);
      } else {
        return NextResponse.redirect(remote, 302);
      }
    }
    const pool = productImage(id, category, name) || productImageFallback(id, category, name);
    const poolUrl = pool ? fileIfExists(req, pool) : "";
    if (poolUrl) return NextResponse.redirect(poolUrl, 302);
  }

  const svg = productGlyphSvg({ id, name, category });
  return new NextResponse(svg, {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=600",
    },
  });
}
