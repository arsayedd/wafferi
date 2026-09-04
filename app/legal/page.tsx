import Link from "next/link";

export const metadata = { title: "الامتثال" };

export default function LegalPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-10 leading-relaxed">
      <h1 className="font-heading text-3xl font-semibold">الامتثال وحقوق المصادر</h1>
      <p className="text-muted-foreground">
        وفّري طبقة مقارنة لجهاز العروسة في مصر. مش أرشيف لمواقع المتاجر، ومش أداة لتجاوز الحماية.
      </p>
      <section className="space-y-2 text-sm text-muted-foreground">
        <h2 className="text-lg font-medium text-foreground">إيه اللي بنخزّنه</h2>
        <p>
          بيانات تجارية واقعية: الاسم المختصر، SKU/GTIN إن وُجد، السعر، السعر السابق، العملة، التوفر،
          الرابط، البائع، الوقت. مش بنعيد نشر وصف المنتج، ولا الصور، ولا النصوص التسويقية، ولا تصميم
          الصفحة.
        </p>
        <h2 className="text-lg font-medium text-foreground">robots.txt والمعدل</h2>
        <p>
          مسار المراقبة يقرأ robots.txt لنفس الأصل ويتوقف لو المسار ممنوع. فيد الأفلييت اللي إنتي
          حاطاه بإيدك يتعامل كمصدر مصرّح. مفيش residential proxies ولا إدارة بصمة متصفح ولا حل CAPTCHA.
        </p>
        <h2 className="text-lg font-medium text-foreground">الاحتفاظ والحذف</h2>
        <p>
          التاريخ على الجهاز (localStorage). مسح بيانات الموقع من المتصفح بيحذف المراقبة. مفيش بيع
          لبيانات العروسة لطرف تالت في النسخة دي.
        </p>
        <h2 className="text-lg font-medium text-foreground">شروط المتاجر</h2>
        <p>
          الزحف التجاري الواسع على كتالوجات مصر يحتاج مراجعة ToS كل مصدر وترخيص/فيد. البوت الحالي
          مصمَّم لروابط/فيدات محددة، مش لملايين الصفحات.
        </p>
      </section>
      <Link href="/intel" className="text-primary underline">
        المراقبة
      </Link>
    </article>
  );
}
