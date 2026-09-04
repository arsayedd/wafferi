"use client";

import { WaffariProvider } from "@/hooks/use-waffari";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <WaffariProvider>
        {children}
        <Toaster position="top-center" dir="rtl" />
      </WaffariProvider>
    </ThemeProvider>
  );
}
