import { notFound } from "next/navigation";
import { categories } from "@/lib/catalog";
import { SearchExperience } from "@/components/search-experience";
import { Suspense } from "react";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((x) => x.id === slug);
  return { title: c?.name ?? "فئة" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categories.find((x) => x.id === slug);
  if (!c) notFound();
  return (
    <Suspense>
      <SearchExperience initialCategory={c.id} />
    </Suspense>
  );
}
