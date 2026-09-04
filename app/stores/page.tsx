import { NetworkBoard } from "@/components/network-board";
import { SourceCopyright } from "@/components/source-copyright";
import { stores } from "@/lib/catalog";

export const metadata = { title: "المصادر وحقوقهم" };

export default function StoresPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold">المصادر — مش كتالوجنا</h1>
      <p className="max-w-3xl text-muted-foreground">
        دليل سلاسل مصر: رنين، التوحيد والنور، الريادة، جوميا، نون، بي تك، فتح الله، أولاد رجب،
        ايكيا، هومزمارت وغيرهم. وفّري مش مالكة للمتاجر ولا بتسحب كل رف في مصر لحظي — كل منتج
        بيتوجّه لبحث المتجر أو `site:` على جوجل. الأسعار في الكروت مرجعية لحد ما يتوفر فيد رسمي.
      </p>
      <SourceCopyright />
      <p className="text-sm text-muted-foreground">{stores.length} اسم مصدر للربط والتوجيه.</p>
      <NetworkBoard />
    </div>
  );
}
