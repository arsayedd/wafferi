import Link from "next/link";
import { SourceCopyright } from "@/components/source-copyright";

export const metadata = { title: "أسعار لحظية" };

export default function LivePage() {
  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-16">
      <h1 className="font-heading text-3xl font-semibold">مفيش بورصة أسعار لحظية</h1>
      <p className="text-muted-foreground">
        وفّري مش بتسحب مخزون المتاجر كل ثانية. المنتج يتربط بمصدره، والسعر المعروض مرجعي
        للتوضيح — الشراء والسعر النهائي على موقع المصدر.
      </p>
      <SourceCopyright />
      <Link href="/stores" className="text-primary underline">
        صفحة المصادر وحقوقهم
      </Link>
    </div>
  );
}
