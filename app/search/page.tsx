import { Suspense } from "react";
import { SearchExperience } from "@/components/search-experience";

export const metadata = { title: "السوق" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">جاري تجهيز البحث…</div>}>
      <SearchExperience />
    </Suspense>
  );
}
