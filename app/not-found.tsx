import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="font-heading text-3xl font-semibold">الصفحة مش موجودة</h1>
      <p className="mt-2 text-muted-foreground">الرابط غلط أو المنتج اتشال من الكتالوج التجريبي.</p>
      <Button className="mt-6" nativeButton={false} render={<Link href="/" />}>
        الرجوع للرئيسية
      </Button>
    </div>
  );
}
