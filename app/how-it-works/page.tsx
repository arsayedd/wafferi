export const metadata = { title: "إزاي بنشتغل" };

export default function HowPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-4 py-10 leading-relaxed">
      <h1 className="font-heading text-3xl font-semibold">إزاي وفّري بتشتغل</h1>
      <p className="text-muted-foreground">
        وفّري مش متجر. طبقة مقارنة وأفلييت فوق أي إيكوميرس في مصر بيبيع جهاز للحياة
        اليومية: غسيل، تبريد، تكييف، طبخ، تنظيف، مياه، شاشات، عناية شخصية، وأثاث البيت.
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-medium">إزاي بنوصل بكل المواقع</h2>
        <p className="text-sm">
          مفيش زر واحد بيربط «كل الإنترنت». الشبكة بتتبني متجر متجر، وكل واحد ليه موصل:
        </p>
        <ol className="list-decimal space-y-2 pr-5 text-sm">
          <li>أفلييت مباشر: جوميا ونون وأمازون — أسرع عمولة وأوضح فيد.</li>
          <li>شبكات زي ArabClicks وAdmitad — بتلم سلاسل أجهزة وهايبر تحت عقد واحد.</li>
          <li>فيد رسمي / بوابة علامة: العربي، فريش، كريازي، سامسونج، إل جي، ايكيا.</li>
          <li>شراكة لياد للمحلات اللي مالهاش برنامج (رنين، النخيلي، هايبر وان).</li>
        </ol>
        <p className="text-sm text-muted-foreground">
          السكرابينج مش عمود فقري: مخالف لشروط كتير من المواقع وسهل ينكسر. نستخدمه فقط لو
          فيد رسمي مش متاح وبعد مراجعة قانونية.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-medium">مصادر البيانات</h2>
        <ol className="list-decimal space-y-2 pr-5 text-sm">
          <li>
            شبكات الأفلييت الجاهزة: جوميا مباشرة، نون، وArabClicks لتجار كتير تحت مظلة واحدة.
          </li>
          <li>
            فيدات رسمية من المتاجر اللي نعمل معاها شراكة (خصوصًا أثاث ومطابخ محلية).
          </li>
          <li>
            التقييمات من صفحة المتجر نفسه، وبعدين تقييم داخلي من اللي اشتروا عن طريق وفّري.
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          السكرابينج مش عمود فقري. لو اتعمل هيكون بحذر قانوني وبعد مراجعة شروط كل موقع.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-medium">مطابقة المنتجات</h2>
        <p className="text-sm">
          «غسالة إل جي 8 كيلو» على جوميا مش بنفس الاسم على نون. المحرك بيرتّب: باركود →
          ماركة+فئة+سعة → تشابه نصي. اللي مش متأكد بيتراجع يدوي قبل ما يتدمج. تقدري
          تشوفي النموذج على صفحة محرك المطابقة.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-medium">الفلوس</h2>
        <p className="text-sm">
          لما تضغطي «اشتري من المتجر» بتتحولي برابط أفلييت. السعر ليكي زي ما هو؛ العمولة
          بتيجي لوفّري لو العملية اتمّت. لاحقًا: ترتيب ممول للمتاجر، لياد للمحلات الصغيرة،
          ومميزات تنبيه مدفوعة.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-medium">النسخة اللي قدامك</h2>
        <p className="text-sm">
          دي MVP تفاعلية: بحث، فلاتر، مقارنة، قايمة جهاز، تنبيهات محفوظة على جهازك، ومقارنة
          بين 3 منتجات. الأسعار تجريبية عشان التجربة تشتغل من غير مفاتيح API.
        </p>
      </section>
    </article>
  );
}
