import { Suspense } from "react";
import SourcingClient from "./sourcing-client";

export const metadata = { title: "خريطة مصادر العروسة" };

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">جاري فتح خريطة المصادر…</div>}>
      <SourcingClient />
    </Suspense>
  );
}
