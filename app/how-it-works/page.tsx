export const metadata = { title: "إزاي بنشتغل" };

export default function HowPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-10 leading-relaxed">
      <h1 className="font-heading text-3xl font-semibold">إزاي وفّري بتشتغل</h1>
      <p className="text-muted-foreground">
        وفّري مش البائع. بنلمّ عروض المصدر، بنكتب اسم المتجر على الكارت، وبنحوّل العميلة
        لصفحة المنتج عنده. العمولة أو الكوبون بتوعكِ يتركّبوا على اللينك.
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-medium">السحب من المصدر</h2>
        <p className="text-sm">
          السحب اللي بنعمله هو فيد رسمي: CSV/JSON من لوحة الأفلييت أو من التاجر بعد
          التصريح. صفحة «فيد وأفلييت» تقدر تسحب الرابط أو تلصق الملف. لو الرابط صفحة
          HTML لمتجر، بنرفضه — مش هنزحف على جوميا ونون كصفحات.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-medium">المصدر ظاهر، والتحويل عليهم</h2>
        <p className="text-sm">
          كل عرض مكتوب عليه اسم المتجر والدومين. زرار الشراء بيفتح موقعهم في تاب جديد،
          مش checkout جوّه وفّري. تقدري تظبّطي رقم الأفلييت والكوبون لكل مصدر؛ بيتضافوا
          على الرابط (aff_id / coupon / tag لأمazon).
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-medium">الفلوس</h2>
        <p className="text-sm">
          السعر للي بتشتري زي ما هو عند المصدر. لو العملية تمت من لينك فيه أفلييتكم،
          العمولة ترجع لوفّري حسب عقد جوميا/نون/الشبكة.
        </p>
      </section>
    </article>
  );
}
