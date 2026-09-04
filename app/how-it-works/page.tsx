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
        <h2 className="text-xl font-medium">أسعار حية زي Pricena</h2>
        <p className="text-sm">
          فيد CSV/JSON/XML، Shopify JSON، WooCommerce Store API، JSON-LD/Open Graph من
          صفحة المنتج، وAmazon Creators API لو المفاتيح موجودة. التفاصيل في «الموصّلات».
          مش بنعدّي حماية المتجر ولا بنزحف الكتالوج كامل.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-medium">السحب من المصدر</h2>
        <p className="text-sm">
          السحب من فيد أو API أو بيانات منظمة على صفحة المنتج. التفاصيل في صفحة الموصّلات.
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
        <h2 className="text-xl font-medium">لو هتنزلي</h2>
        <p className="text-sm">
          الأحياء متجمّعة عندنا: حمام التلات للحلل، عبدالعزيز للأجهزة، الصاغة للذهب،
          دمياط للأثاث. البحث بيرميكِ على الحي المناسب من الداتا دي، من غير Google
          Search ولا Places API. خريطة المصادر على «المصادر» بتقسّم كل فئة لأونلاين
          وجملة ومصنع.
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
