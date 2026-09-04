"use client";

import Link from "next/link";
import { Star, Store, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductArt } from "@/components/product-art";
import { getStore } from "@/lib/catalog";
import { formatNumber, formatPrice } from "@/lib/format";
import { productStats } from "@/lib/stats";
import type { Product } from "@/lib/types";
import { useWaffari } from "@/hooks/use-waffari";

export function ProductCard({ product }: { product: Product }) {
  const { cheap, save, rating, stores } = productStats(product);
  const store = getStore(cheap.storeId);
  const { addItem, items, toggleCompare, compare } = useWaffari();
  const inList = items.some((i) => i.productId === product.id);
  const inCompare = compare.includes(product.id);

  return (
    <Card className="h-full py-0">
      <Link href={`/product/${product.id}`} className="block">
        <ProductArt category={product.category} />
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
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Store className="size-3" />
            الأرخص عند {store?.name} · {stores} متاجر
          </p>
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
      </CardFooter>
    </Card>
  );
}
