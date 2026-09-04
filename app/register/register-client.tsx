"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import {
  EGYPT_CITIES,
  emptyProfile,
  ROLE_LABEL,
  type BrideProfile,
  type UserRole,
} from "@/lib/session";
import { houseTiers } from "@/lib/sourcing";
import { TIER_AR } from "@/lib/bride-plan";
import { cn } from "@/lib/utils";

export default function RegisterClient() {
  const router = useRouter();
  const { register } = useSession();
  const [p, setP] = useState<BrideProfile>(emptyProfile);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");

  function set<K extends keyof BrideProfile>(key: K, value: BrideProfile[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb end-[-10%] top-[-20%] size-96 bg-accent/30" />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <div className="rise space-y-2">
          <p className="text-sm text-primary">حساب عروسة — مش فورم قصير</p>
          <h1 className="font-heading text-3xl font-semibold md:text-4xl">
            سجّلي عشان السيستم يعرفكِ
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            الاسم، الفرح، الشقة، الميزانية. بعد التسجيل بنفتح خطة الجهاز بنفس الإجابات.
            الحساب للتجربة على جهازكِ؛ من غير بريد تفعيل ولا بنك.
          </p>
        </div>

        <form
          noValidate
          className="rise-2 space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (password !== confirm) {
              setErr("تأكيد الباسورد مش مطابق");
              return;
            }
            const msg = register(p, password);
            if (msg) {
              setErr(msg);
              return;
            }
            toast.success("اتفتح حسابكِ — كمّلي الخطة");
            router.push("/plan");
          }}
        >
          <fieldset className="space-y-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
            <legend className="px-1 text-sm font-medium">مين إنتي</legend>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ROLE_LABEL) as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set("role", r)}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm",
                    p.role === r ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {ROLE_LABEL[r]}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                الاسم الأول
                <Input className="h-11" value={p.firstName} onChange={(e) => set("firstName", e.target.value)} required />
              </label>
              <label className="space-y-1 text-sm">
                اسم العيلة
                <Input className="h-11" value={p.lastName} onChange={(e) => set("lastName", e.target.value)} />
              </label>
              <label className="space-y-1 text-sm">
                اسم العريس (اختياري)
                <Input className="h-11" value={p.groomName} onChange={(e) => set("groomName", e.target.value)} />
              </label>
              <label className="space-y-1 text-sm">
                موبايل
                <Input className="h-11" inputMode="tel" value={p.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01…" />
              </label>
              <label className="space-y-1 text-sm sm:col-span-2">
                إيميل
                <Input className="h-11" type="email" value={p.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label className="space-y-1 text-sm">
                باسورد (٦ حروف+)
                <Input className="h-11" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <label className="space-y-1 text-sm">
                تأكيد الباسورد
                <Input className="h-11" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
              </label>
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
            <legend className="px-1 text-sm font-medium">الفرح والمكان</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                تاريخ الفرح
                <Input className="h-11" type="date" value={p.weddingDate} onChange={(e) => set("weddingDate", e.target.value)} />
              </label>
              <label className="space-y-1 text-sm">
                فاضل كام شهر؟
                <Input
                  className="h-11"
                  inputMode="numeric"
                  value={p.months}
                  onChange={(e) => set("months", Number(e.target.value) || 1)}
                />
              </label>
              <label className="space-y-1 text-sm">
                المحافظة
                <select
                  className="h-11 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                  value={p.city}
                  onChange={(e) => set("city", e.target.value)}
                >
                  {EGYPT_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm">
                الحي / المنطقة
                <Input className="h-11" value={p.area} onChange={(e) => set("area", e.target.value)} placeholder="مدينة نصر، المعادي…" />
              </label>
              <label className="space-y-1 text-sm">
                عدد المدعوين التقريبي
                <Input className="h-11" value={p.guests} onChange={(e) => set("guests", e.target.value)} placeholder="مثلاً 250" />
              </label>
              <label className="space-y-1 text-sm">
                ميزانية الجهاز بالجنيه
                <Input
                  className="h-11"
                  inputMode="numeric"
                  value={p.budget}
                  onChange={(e) => set("budget", Number(e.target.value) || 0)}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
            <legend className="px-1 text-sm font-medium">الشقة والجهاز</legend>
            <p className="text-xs text-muted-foreground">السيستم يشيل الأثاث أو الأجهزة لو قلتي إنها موجودة.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["finished", "الشقة متشطبة؟"],
                  ["furnished", "الشقة مفروشة؟"],
                  ["hasKitchen", "المطبخ موجود؟"],
                  ["hasAppliances", "الأجهزة الكبيرة موجودة؟"],
                ] as const
              ).map(([key, lab]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set(key, !p[key])}
                  className={cn(
                    "rounded-xl px-3 py-2 text-start text-sm ring-1 ring-foreground/10",
                    p[key] ? "bg-secondary" : "bg-muted/40",
                  )}
                >
                  {lab} — {p[key] ? "أيوه" : "لأ"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-sm">
                غرف نوم
                <Input
                  className="h-11"
                  inputMode="numeric"
                  value={p.bedrooms}
                  onChange={(e) => set("bedrooms", Number(e.target.value) || 1)}
                />
              </label>
              <label className="space-y-1 text-sm">
                حمّامات
                <Input
                  className="h-11"
                  inputMode="numeric"
                  value={p.bathrooms}
                  onChange={(e) => set("bathrooms", Number(e.target.value) || 1)}
                />
              </label>
            </div>
            <div>
              <p className="mb-2 text-sm">مستوى الجهاز</p>
              <div className="flex flex-wrap gap-2">
                {houseTiers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => set("tier", t.id)}
                    className={cn(
                      "rounded-full px-3 py-1 text-sm",
                      p.tier === t.id ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    {TIER_AR[t.id]}
                  </button>
                ))}
              </div>
            </div>
            <label className="block space-y-1 text-sm">
              ملاحظات (قاعة محجوزة، ذهب خلص، …)
              <textarea
                className="min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={p.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </label>
          </fieldset>

          {err ? <p className="text-sm text-destructive">{err}</p> : null}
          <button type="submit" className={cn(buttonVariants(), "h-12 w-full sm:w-auto px-8")}>
            إنشاء الحساب وفتح الخطة
          </button>
        </form>

        <p className="text-sm text-muted-foreground">
          عندك حساب؟{" "}
          <Link href="/login" className="text-primary underline">
            دخولي
          </Link>
        </p>
      </div>
    </div>
  );
}
