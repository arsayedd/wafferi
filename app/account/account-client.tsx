"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { displayName, ROLE_LABEL } from "@/lib/session";
import { TIER_AR } from "@/lib/bride-plan";
import { cn } from "@/lib/utils";

export default function AccountClient() {
  const router = useRouter();
  const { user, logout, ready } = useSession();

  if (!ready) {
    return <p className="p-10 text-center text-muted-foreground">جاري فتح الحساب…</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-semibold">مفيش جلسة مفتوحة</h1>
        <p className="text-sm text-muted-foreground">سجّلي أو دخلي عشان تشوفي بيانات الفرح.</p>
        <div className="flex justify-center gap-2">
          <Link href="/login" className={cn(buttonVariants())}>
            دخول
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: "outline" }))}>
            تسجيل
          </Link>
        </div>
      </div>
    );
  }

  const rows: [string, string][] = [
    ["الدور", ROLE_LABEL[user.role]],
    ["العريس", user.groomName || "—"],
    ["موبايل", user.phone || "—"],
    ["إيميل", user.email || "—"],
    ["المحافظة", user.city],
    ["الحي", user.area || "—"],
    ["تاريخ الفرح", user.weddingDate || "—"],
    ["الشهور المتبقية", String(user.months)],
    ["الميزانية", `${user.budget.toLocaleString("ar-EG")} ج`],
    ["المدعوين", user.guests || "—"],
    ["تشطيب", user.finished ? "أيوه" : "لأ"],
    ["مفروشة", user.furnished ? "أيوه" : "لأ"],
    ["مطبخ", user.hasKitchen ? "موجود" : "لأ"],
    ["أجهزة", user.hasAppliances ? "موجودة" : "لأ"],
    ["غرف / حمّام", `${user.bedrooms} / ${user.bathrooms}`],
    ["مستوى الجهاز", TIER_AR[user.tier]],
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div>
        <p className="text-sm text-primary">حسابكِ على الجهاز</p>
        <h1 className="font-heading text-3xl font-semibold">{displayName(user)}</h1>
        {user.notes ? <p className="mt-2 text-sm text-muted-foreground">{user.notes}</p> : null}
      </div>
      <ul className="divide-y rounded-2xl bg-card ring-1 ring-foreground/10">
        {rows.map(([k, v]) => (
          <li key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
            <span className="text-muted-foreground">{k}</span>
            <span>{v}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Link href="/plan" className={cn(buttonVariants())}>
          خطة الجهاز
        </Link>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }))}
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          خروج
        </button>
      </div>
    </div>
  );
}
