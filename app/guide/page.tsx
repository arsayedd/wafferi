import { Suspense } from "react";
import GuideClient from "./guide-client";

export const metadata = { title: "دليل العروسة" };

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">جاري فتح الدليل…</div>}>
      <GuideClient />
    </Suspense>
  );
}
