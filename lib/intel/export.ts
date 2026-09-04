import type { CompetitiveSnapshot } from "./types";
import { downloadCsv } from "../export-setup";

function cell(v: string | number) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Factual competitive fields only — ChangeDetection-style dataset, not a copied PDP. */
export function snapshotsToCsv(rows: CompetitiveSnapshot[]) {
  const header = [
    "name",
    "seller",
    "sku",
    "gtin",
    "price",
    "compare_at",
    "currency",
    "availability",
    "rating",
    "reviews",
    "adapter",
    "url",
    "checked_at",
  ];
  const lines = [header.join(",")];
  for (const s of rows) {
    lines.push(
      [
        cell(s.name),
        cell(s.seller),
        cell(s.sku ?? ""),
        cell(s.gtin ?? ""),
        s.price,
        s.compareAt ?? "",
        s.currency,
        s.availability,
        s.rating ?? "",
        s.reviewCount ?? "",
        s.adapter,
        cell(s.url),
        new Date(s.checkedAt).toISOString(),
      ].join(","),
    );
  }
  return `\uFEFF${lines.join("\n")}`;
}

export function exportSnapshots(rows: CompetitiveSnapshot[], format: "csv" | "json") {
  if (format === "json") {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "waffari-price-watch.json";
    a.click();
    URL.revokeObjectURL(href);
    return;
  }
  downloadCsv("waffari-price-watch.csv", snapshotsToCsv(rows));
}
