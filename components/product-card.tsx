"use client";

import Link from "next/link";
import { Star, TrendingDown, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductPhoto } from "@/components/product-photo";
import { StoreLogo } from "@/components/store-logo";
import { getStore } from "@/lib/catalog";
import { listingHref } from "@/lib/store-link";
import { formatNumber, formatPrice } from "@/lib/format";
import { productStats } from "@/lib/stats";
import type { Product } from "@/lib/types";
import { useWaffari } from "@/hooks/use-waffari";
import { useLive } from "@/hooks/use-live";
import { usePartners } from "@/hooks/use-partners";

export function ProductCard({ product: raw }: { product: Product }) {
  const { liveProduct } = useLive();
  const product = liveProduct(raw);
  const { cheap, save, rating, stores } = productStats(product);
  const store = getStore(cheap.storeId);
  const { addItem, items, toggleCompare, compare } = useWaffari();
  const { outbound } = usePartners();
  const inList = items.some((i) => i.productId === product.id);
  const inCompare = compare.includes(product.id);

  return (
    <Card className="h-full py-0">
      <Link href={`/product/${product.id}`} className="block">
        <ProductPhoto id={product.id} category={product.category} name={product.name} />
      </Link>
      <CardContent className="flex flex-1 flex-col gap-2 pt-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">{product.brand}</span>
          <span className="flex items-center gap-1 text-xs">
            <Star className="size-3 fill-accent text-accent" />
            {rating.toFixed(1)}
          </span>
        </div>
        <Link href={`/product/${product.id}`} className="font-medium leading-snug hover:underline">
          {product.name}
        </Link>
        <div>
          <p className="text-lg font-semibold text-primary">{formatPrice(cheap.price)}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <StoreLogo name={store?.name ?? ""} website={store?.website} size={16} />
            الأرخص: {store?.name}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1">
            {[...product.listings]
              .sort((a, b) => a.price - b.price)
              .slice(0, 8)
              .map((l, i) => {
                const st = getStore(l.storeId);
                return (
                <li key={`${l.storeId}-${l.sku}-${i}`}>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px]">
                    <StoreLogo name={st?.name ?? l.storeId} website={st?.website} size={14} />
                    {st?.name ?? l.storeId} {formatPrice(l.price)}
                    {!l.inStock ? " ✕" : ""}
                  </span>
                </li>
                );
              })}
            {product.listings.length > 8 ? (
              <li className="text-[11px] text-muted-foreground">+{product.listings.length - 8} بائع</li>
            ) : null}
          </ul>
        </div>
        {save > 0 && (
          <Badge variant="secondary" className="w-fit gap-1">
            <TrendingDown className="size-3" />
            توفّري {formatNumber(save)} ج عن أغلى عرض
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          size="sm"
          className="flex-1"
          variant={inList ? "secondary" : "default"}
          onClick={() => {
            if (inList) return;
            addItem(product.id);
            toast.success("اتضافت لقايمة الجهاز");
          }}
        >
          {inList ? "في القايمة" : "أضيفي للجهاز"}
        </Button>
        <Button
          size="sm"
          variant={inCompare ? "secondary" : "outline"}
          onClick={() => toggleCompare(product.id)}
        >
          قارني
        </Button>
        <Button
          size="sm"
          variant="outline"
          title={`افتحي ${store?.name}`}
          onClick={() => {
            const href = listingHref(cheap.storeId, product.name, cheap.url);
            toast.message(`المصدر: ${store?.name}`, {
              description: "هتتحولي لصفحة المنتج عندهم.",
            });
            window.open(href, "_blank", "noopener");
          }}
        >
          <ExternalLink />
        </Button>
      </CardFooter>
    </Card>
  );
}
