"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, Bell, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWaffari } from "@/hooks/use-waffari";
import { useLive } from "@/hooks/use-live";
import { SearchBar } from "@/components/search-bar";

const links = [
  { href: "/guide", label: "الدليل" },
  { href: "/map", label: "الخريطة" },
  { href: "/places", label: "أماكن" },
  { href: "/search", label: "السوق" },
  { href: "/list", label: "القايمة" },
  { href: "/stores", label: "الشبكة" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
        وف
      </span>
      <span className="font-heading text-xl font-semibold tracking-tight text-primary">
        وفّري
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const path = usePathname();
  const { items, alerts, compare, ready } = useWaffari();
  const listLabel = ready ? `القايمة (${items.length})` : "القايمة";
  const { unread } = useLive();
  const bellCount = unread || alerts.length;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-2.5 py-1.5 text-sm ${
                path === l.href || path.startsWith(l.href + "/")
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ms-auto hidden flex-1 justify-end lg:flex">
          <div className="w-full max-w-md">
            <SearchBar compact />
          </div>
        </div>
        <div className="ms-auto flex items-center gap-1 md:ms-0">
          <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/search" />}>
            <Search className="lg:hidden" />
            <span className="sr-only">بحث</span>
          </Button>
          <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/alerts" />}>
            <span className="relative">
              <Bell />
              {bellCount > 0 && (
                <span className="absolute -top-1 -left-1 size-4 rounded-full bg-primary text-[10px] leading-4 text-primary-foreground">
                  {bellCount}
                </span>
              )}
            </span>
          </Button>
          <Button variant="ghost" size="icon" nativeButton={false} render={<Link href="/compare" />}>
            <span className="relative">
              <GitCompare />
              {compare.length > 0 && (
                <span className="absolute -top-1 -left-1 size-4 rounded-full bg-accent text-[10px] leading-4 text-accent-foreground">
                  {compare.length}
                </span>
              )}
            </span>
          </Button>
          <Button nativeButton={false} render={<Link href="/list" />} size="sm" className="hidden sm:inline-flex">
            <ShoppingBag />
            {listLabel}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            type="button"
            aria-label="فتح القائمة"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu />
          </Button>
          {menuOpen ? (
            <div className="fixed inset-0 z-50 md:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="إغلاق القائمة"
                onClick={() => setMenuOpen(false)}
              />
              <aside className="absolute inset-y-0 start-0 flex w-72 flex-col gap-2 bg-background p-4 shadow-lg">
                <p className="px-2 text-sm font-medium">القائمة</p>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/categories"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
                >
                  الفئات
                </Link>
                <Link
                  href="/live"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
                >
                  لحظي
                </Link>
                <Link
                  href="/matching"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
                >
                  محرك المطابقة
                </Link>
                <Link
                  href="/list"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
                >
                  {listLabel}
                </Link>
              </aside>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            مقارنة أسعار جهاز العروسة وكل رحلة التجهيز عبر متاجر وأحياء مصر. الأرخص ظاهر
            للأونلاين، والعمولة من الأفلييت — من غير ما السعر يزيد عليكي.
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">اكتشفي</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <Link href="/places">أماكن وخرائط</Link>
            </li>
            <li>
              <Link href="/map">خريطة الرحلة</Link>
            </li>
            <li>
              <Link href="/guide">دليل العروسة</Link>
            </li>
            <li>
              <Link href="/search">السوق</Link>
            </li>
            <li>
              <Link href="/deals">أوفر سعر اليوم</Link>
            </li>
            <li>
              <Link href="/list">قايمة الجهاز</Link>
            </li>
            <li>
              <Link href="/ingest">فيد وأفلييت</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">الشركاء</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <Link href="/stores">شبكة المتاجر</Link>
            </li>
            <li>
              <Link href="/brands">الماركات</Link>
            </li>
            <li>
              <Link href="/how-it-works">الأفلييت والعمولة</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">تنويه</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            الأسعار في النسخة دي تجريبية للتفاعل، مش لايف من المواقع. الربط
            الحقيقي هيتم عبر برامج الأفلييت الرسمية والشراكات، مش سكرابينج عشوائي.
          </p>
        </div>
      </div>
    </footer>
  );
}
