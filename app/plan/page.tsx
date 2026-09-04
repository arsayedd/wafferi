import { Suspense } from "react";
import PlanClient from "./plan-client";

export const metadata = { title: "رحلة العروسة — خطة الجهاز" };

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">جاري فتح الخطة…</div>}>
      <PlanClient />
    </Suspense>
  );
}
