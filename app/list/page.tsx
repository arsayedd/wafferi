import { Suspense } from "react";
import ListClient from "./list-client";

export const metadata = { title: "قايمة الجهاز" };

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">جاري فتح القايمة…</div>}>
      <ListClient />
    </Suspense>
  );
}
