"use client";

import { WaffariProvider } from "@/hooks/use-waffari";
import { LiveMarketProvider } from "@/hooks/use-live";
import { CatalogOverlayProvider } from "@/hooks/use-catalog";
import { PartnersProvider } from "@/hooks/use-partners";
import { IntelProvider } from "@/hooks/use-intel";
import { SessionProvider } from "@/hooks/use-session";
import { Toaster } from "@/components/ui/sonner";
import { LiveTicker } from "@/components/live-ticker";
import { ThemeProvider } from "next-themes";

function LiveTickerGate() {
  return <LiveTicker />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <SessionProvider>
        <WaffariProvider>
          <CatalogOverlayProvider>
            <LiveMarketProvider>
              <PartnersProvider>
                <IntelProvider>
                  {children}
                  <Toaster />
                  <LiveTickerGate />
                </IntelProvider>
              </PartnersProvider>
            </LiveMarketProvider>
          </CatalogOverlayProvider>
        </WaffariProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
