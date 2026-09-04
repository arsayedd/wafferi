import { Suspense } from "react";
import PlanClient from "./plan-client";

export const metadata = { title: "خطة جهاز العروسة" };

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">جاري فتح الخطة…</div>}>
      <PlanClient />
    </Suspense>
  );
}
