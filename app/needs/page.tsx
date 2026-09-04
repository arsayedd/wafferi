import { Suspense } from "react";
import NeedsClient from "./needs-client";

export const metadata = { title: "احتياجات العروسة" };

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">جاري فتح الاحتياجات…</div>}>
      <NeedsClient />
    </Suspense>
  );
}
