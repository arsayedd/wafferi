import { NetworkBoard } from "@/components/network-board";
import { networkStats } from "@/lib/network";
import { products } from "@/lib/catalog";

export const metadata = { title: "شبكة المتاجر" };

export default function StoresPage() {
  const stats = networkStats();
  const listingCount = products.reduce((n, p) => n + p.listings.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold">شبكة متاجر الأجهزة في مصر</h1>
      <p className="mt-2 max-w-3xl text-muted-foreground">
        الهدف: أي موقع إيكوميرس بيبيع جهاز للحياة اليومية — غسالة أو مروحة أو سشوار —
        يدخل الشبكة. الربط يتم بأفلييت أو فيد رسمي أو شراكة، مش سكرابينج عشوائي.
        العروض اللي قدامك اتوسّعت من الكتالوج على كل المتاجر المتوافقة مع فئة المنتج.
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <strong className="block text-2xl text-primary">{stats.total}</strong>
          متجر في الشبكة
        </li>
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <strong className="block text-2xl text-primary">{stats.connected}</strong>
          متصلين في الـ MVP
        </li>
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <strong className="block text-2xl text-primary">{stats.affiliate}</strong>
          عليهم مسار عمولة
        </li>
        <li className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
          <strong className="block text-2xl text-primary">
            {listingCount.toLocaleString("ar-EG")}
          </strong>
          عرض سعر موحّد
        </li>
      </ul>
      <div className="mt-8">
        <NetworkBoard />
      </div>
    </div>
  );
}
