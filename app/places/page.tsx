import { Suspense } from "react";
import PlacesClient from "./places-client";

export const metadata = { title: "أماكن على الخريطة" };

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">جاري فتح الأماكن…</div>}>
      <PlacesClient />
    </Suspense>
  );
}
