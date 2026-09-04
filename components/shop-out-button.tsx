"use client";

import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isDeadShopUrl } from "@/lib/dead-hosts";
import { listingHref } from "@/lib/store-link";
import { usePartners } from "@/hooks/use-partners";
import { getStore } from "@/lib/catalog";

export function shopHref(
  storeId: string,
  productName: string,
  coupon?: string,
  outbound?: (url: string, storeId: string, coupon?: string, name?: string) => string,
) {
  const built = outbound
    ? outbound(listingHref(storeId, productName), storeId, coupon, productName)
    : listingHref(storeId, productName);
  if (isDeadShopUrl(built) || /tradeline\.com\.eg|carrefouregypt|\/p\/[a-z0-9_-]+/i.test(built)) {
    return listingHref(storeId, productName);
  }
  return built;
}

function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "رابط آمن";
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

  if (!inStock) {
    return (
      <Button size="sm" variant="outline" disabled>
        غير متوفر
      </Button>
    );
  }

  return (
    <div className={`flex flex-col ${compact ? "items-center" : "items-end"} gap-1`}>
      <Button
        size="sm"
        variant={cheapest ? "default" : "outline"}
        nativeButton={false}
        render={<a href={href} target="_blank" rel="noopener noreferrer" title={href} />}
        onClick={() =>
          toast.message(`هتحوّلي على ${name}`, {
            description:
              storeId === "tradeline"
                ? "tradeline.com.eg مش شغال. الرابط بحث على tradelinestores.com."
                : storeId === "carrefour"
                  ? "كارفور أونلاين فيه عطل DNS. الرابط بحث جوجل باسم المنتج."
                  : "بحث الاسم — مش صفحة /p/ وهمية.",
          })
        }
      >
        {compact ? <ExternalLink /> : label ?? `اشتري من ${name}`}
        {compact ? null : <ExternalLink />}
      </Button>
      {compact ? null : (
        <span className="max-w-[220px] truncate font-mono text-[10px] text-muted-foreground" title={href}>
          {hostOf(href)}
        </span>
      )}
    </div>
  );
}
