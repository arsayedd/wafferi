import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "وفّري — جهاز العروسة بأوفر سعر في مصر",
    template: "%s | وفّري",
  },
  description:
    "قارني أسعار الأثاث والأجهزة المنزلية عبر متاجر مصر، ابنِي قايمة جهاز بميزانية، واشتري من خلال روابط الأفلييت.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
