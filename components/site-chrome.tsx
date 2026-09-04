"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, Bell, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useWaffari } from "@/hooks/use-waffari";
import { SearchBar } from "@/components/search-bar";

const links = [
  { href: "/search", label: "السوق" },
  { href: "/categories", label: "الفئات" },
  { href: "/deals", label: "أوفر سعر" },
  { href: "/list", label: "قايمة الجهاز" },
  { href: "/stores", label: "الشبكة" },
  { href: "/how-it-works", label: "إزاي بنشتغل" },
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
  const { items, alerts, compare } = useWaffari();

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
              {alerts.length > 0 && (
                <span className="absolute -top-1 -left-1 size-4 rounded-full bg-primary text-[10px] leading-4 text-primary-foreground">
                  {alerts.length}
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
            القايمة ({items.length})
          </Button>
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>القائمة</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-lg px-2 py-2 text-sm hover:bg-muted"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link href="/brands" className="rounded-lg px-2 py-2 text-sm hover:bg-muted">
                  الماركات
                </Link>
                <Link href="/matching" className="rounded-lg px-2 py-2 text-sm hover:bg-muted">
                  محرك المطابقة
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
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
            مقارنة أسعار جهاز العروسة عبر متاجر مصر. الأرخص ظاهر، والعمولة من
            الأفلييت — من غير ما السعر يزيد عليكي.
          </p>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">اكتشفي</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
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
              <Link href="/matching">محرك المطابقة</Link>
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
