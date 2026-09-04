"use client";

import { WaffariProvider } from "@/hooks/use-waffari";
import { LiveMarketProvider } from "@/hooks/use-live";
import { CatalogOverlayProvider } from "@/hooks/use-catalog";
import { PartnersProvider } from "@/hooks/use-partners";
import { SessionProvider } from "@/hooks/use-session";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { LiveTicker } from "@/components/live-ticker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <SessionProvider>
        <WaffariProvider>
          <LiveMarketProvider>
            <CatalogOverlayProvider>
              <PartnersProvider>
                <LiveTicker />
                {children}
                <Toaster />
              </PartnersProvider>
            </CatalogOverlayProvider>
          </LiveMarketProvider>
        </WaffariProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
