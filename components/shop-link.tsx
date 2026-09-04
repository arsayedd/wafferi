"use client";

import { shopHref } from "@/components/shop-out-button";
import { usePartners } from "@/hooks/use-partners";
import { getStore } from "@/lib/catalog";

export function ShopLink({
  storeId,
  productName,
  className,
  children,
}: {
  storeId: string;
  productName: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { outbound } = usePartners();
  const href = shopHref(storeId, productName, undefined, outbound);
  const name = getStore(storeId)?.name ?? storeId;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={`فتح ${name} — ${href}`}
    >
      {children}
    </a>
  );
}
