"use client";

import { WaffariProvider } from "@/hooks/use-waffari";
import { LiveMarketProvider } from "@/hooks/use-live";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { LiveTicker } from "@/components/live-ticker";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <WaffariProvider>
        <LiveMarketProvider>
          <LiveTicker />
          {children}
          <Toaster />
        </LiveMarketProvider>
      </WaffariProvider>
    </ThemeProvider>
  );
}
