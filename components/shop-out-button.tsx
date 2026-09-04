"use client";

import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { isDeadShopUrl } from "@/lib/dead-hosts";
import { listingHref, canShopOut } from "@/lib/store-link";
import { usePartners } from "@/hooks/use-partners";
import { useLiveShopHref } from "@/hooks/use-live-shop-href";
import { getStore } from "@/lib/catalog";

export function shopHref(
  storeId: string,
  productName: string,
  coupon?: string,
  outbound?: (url: string, storeId: string, coupon?: string, name?: string) => string,
) {
  const raw = listingHref(storeId, productName);
  if (!raw) return "";
  const built = outbound
    ? outbound(raw, storeId, coupon, productName)
    : raw;
  if (isDeadShopUrl(built) || /tradeline\.com\.eg|carrefouregypt|\/p\/[a-z0-9_-]+/i.test(built)) {
    return listingHref(storeId, productName);
  }
  return built;
}

function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "رابط";
  }
}

export function ShopOutButton({
  storeId,
  productName,
  coupon,
  inStock = true,
  cheapest = false,
  label,
  compact = false,
}: {
  storeId: string;
  productName: string;
  coupon?: string;
  inStock?: boolean;
  cheapest?: boolean;
  label?: string;
  compact?: boolean;
}) {
  const { outbound } = usePartners();
  const store = getStore(storeId);
  const href = shopHref(storeId, productName, coupon, outbound);
  const name = store?.name ?? "المصدر";
  const { ok, checked } = useLiveShopHref(href);

  if (!href || !canShopOut(storeId) || (checked && !ok) || !checked) {
    return null;
  }

  if (!inStock) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={href}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        {compact ? <ExternalLink /> : `شوفي البحث عند ${name}`}
      </a>
    );
  }

  return (
    <div className={`flex ${compact ? "flex-row" : "flex-col items-end"} gap-1`}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={href}
        className={cn(buttonVariants({ variant: cheapest ? "default" : "outline", size: "sm" }))}
        onClick={() => toast.message(`هتفتحي ${name}`)}
      >
        {compact ? <ExternalLink /> : label ?? `اشتري من ${name}`}
        {compact ? null : <ExternalLink />}
      </a>
      {compact ? null : (
        <div className="flex max-w-[240px] items-center gap-1">
          <span className="truncate font-mono text-[10px] text-muted-foreground" title={href}>
            {hostOf(href)}
          </span>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            title="نسخ الرابط"
            onClick={() => {
              void navigator.clipboard?.writeText(href);
              toast.success("اتنسخ الرابط");
            }}
          >
            <Copy className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}
