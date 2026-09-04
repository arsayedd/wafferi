export function SourceCopyright({
  sourceName,
  names,
  compact = false,
}: {
  sourceName?: string;
  names?: (string | undefined | null)[];
  compact?: boolean;
}) {
  const listed = [
    ...(sourceName ? [sourceName] : []),
    ...(names ?? []).filter((n): n is string => Boolean(n)),
  ];
  const unique = [...new Set(listed)];
  const who =
    unique.length > 0 ? `${unique.join("، ")} علامات/متاجر مستقلة. ` : "";

  if (compact) {
    return (
      <p className="text-xs leading-relaxed text-muted-foreground">
        {who}
        الاسم والسعر والصور الرسمية حقوق المصدر. وفّري بتوجّه للينك، مش بتبيع.
      </p>
    );
  }
  return (
    <aside className="rounded-xl bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
      <p className="font-medium text-foreground">حقوق المصدر</p>
      <p className="mt-1">
        {who}
          جوميا، نون، أمازون، كارفور، ايكيا، وباقي الأسماء المعروضة علامات تجارية وحقوق
        أصحابها. وفّري مش مالكة للكتالوج. السعر يتحدّث من فيد المصدر المصرّح لما يتوفر،
        وإلا يبقى رقم مرجعي. مش من سحب صفحات المتاجر. كل منتج متربط بعرض مصدر: الاسم ظاهر،
        والضغط بيفتح موقعهم. الصور هنا توضيحية (من ضمنها Unsplash) وليست بالضرورة صورة
        المنتج الرسمية عند التاجر.
      </p>
    </aside>
  );
}
