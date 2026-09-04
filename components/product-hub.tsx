"use client";

import Link from "next/link";
import { getProduct, cheapestListing, getStore } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { ProductPhoto } from "@/components/product-photo";
import {
  pricenaSearchUrl,
  youtubeReviewUrl,
  youtubeSearchEmbed,
  videoQueries,
  gsmarenaSearchUrl,
  mobizilSearchUrl,
  versusIds,
} from "@/lib/product-research";
import type { Product } from "@/lib/types";

const TOC = [
  { href: "#secPrices", label: "الأسعار" },
  { href: "#secSpecs", label: "المواصفات" },
  { href: "#secVideos", label: "الفيديوهات" },
  { href: "#secCompare", label: "المقارنات" },
  { href: "#secReviews", label: "الآراء" },
];

export function ProductToc() {
  return (
    <nav className="sticky top-16 z-30 -mx-4 flex gap-1 overflow-x-auto border-y bg-background/95 px-4 py-2 backdrop-blur md:mx-0 md:rounded-xl md:border">
      {TOC.map((t) => (
        <a
          key={t.href}
          href={t.href}
          className="shrink-0 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {t.label}
        </a>
      ))}
    </nav>
  );
}

export function ProductVideos({ product }: { product: Product }) {
  const clips = videoQueries(product);
  return (
    <section id="secVideos" className="scroll-mt-28 space-y-3">
      <h2 className="font-heading text-xl font-semibold">فيديوهات المراجعة والمقارنة</h2>
      <p className="text-sm text-muted-foreground">
        مش بنرفع فيديوهات برايسينا. دي نتائج بحث يوتيوب على اسم الموديل — مراجعة، مقارنة، وكاميرا.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        {clips.map((c) => (
          <figure key={c.id} className="space-y-2">
            <div className="aspect-video overflow-hidden rounded-xl bg-black ring-1 ring-foreground/10">
              <iframe
                title={c.title}
                src={youtubeSearchEmbed(c.q)}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <figcaption className="text-sm font-medium">{c.title}</figcaption>
          </figure>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        <a className="text-sm text-primary underline" href={youtubeReviewUrl(product)} target="_blank" rel="noreferrer">
          كل نتائج يوتيوب
        </a>
        <a className="text-sm text-primary underline" href={pricenaSearchUrl(product)} target="_blank" rel="noreferrer">
          بحث برايسينا مصر
        </a>
        {(product.category === "phones" || product.category === "tablets") && (
          <>
            <a className="text-sm text-primary underline" href={gsmarenaSearchUrl(product)} target="_blank" rel="noreferrer">
              GSMArena
            </a>
            <a className="text-sm text-primary underline" href={mobizilSearchUrl(product)} target="_blank" rel="noreferrer">
              موبيزيل
            </a>
          </>
        )}
      </div>
    </section>
  );
}

export function VersusStrip({ product }: { product: Product }) {
  const rivals = versusIds(product)
    .map((id) => getProduct(id))
    .filter((p): p is Product => Boolean(p));
  if (!rivals.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {rivals.map((r) => {
        const cheap = cheapestListing(r);
        return (
          <Link
            key={r.id}
            href={`/product/${r.id}`}
            className="rounded-xl bg-card p-3 ring-1 ring-foreground/10 hover:bg-secondary"
          >
            <p className="text-xs text-muted-foreground">قارن مع</p>
            <ProductPhoto
              id={r.id}
              category={r.category}
              name={r.name}
              brand={r.brand}
              model={r.model}
              className="my-2 rounded-lg"
            />
            <p className="text-sm font-medium">{r.name}</p>
            <p className="text-xs text-primary">{formatPrice(cheap.price)}</p>
            <p className="text-[11px] text-muted-foreground">{getStore(cheap.storeId)?.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
