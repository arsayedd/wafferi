import { NetworkBoard } from "@/components/network-board";
import { SourceCopyright } from "@/components/source-copyright";
import { stores } from "@/lib/catalog";

export const metadata = { title: "المصادر وحقوقهم" };

export default function StoresPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold">المصادر — مش كتالوجنا</h1>
      <p className="max-w-3xl text-muted-foreground">
        وفّري مش مالكة لمتاجر جوميا ونون وكارفور ولا لأسعارهم. كل منتج في الدليل أو الخطة
        متربط باسم المصدر ولينك الخروج عليه. الأسماء والشعارات والصور الرسمية حقوق
        أصحابها. مفيش تحديث لحظي للمخزون من عندنا.
      </p>
      <SourceCopyright />
      <p className="text-sm text-muted-foreground">{stores.length} اسم مصدر للربط والتوجيه.</p>
      <NetworkBoard />
    </div>
  );
}
