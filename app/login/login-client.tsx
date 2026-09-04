"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";

export default function LoginClient() {
  const router = useRouter();
  const { login } = useSession();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="relative overflow-hidden">
      <div className="orb start-[-20%] top-[-30%] size-80 bg-primary/15" />
      <div className="mx-auto max-w-md space-y-6 px-4 py-14">
        <div className="rise space-y-2">
          <p className="text-sm text-primary">حساب وفّري</p>
          <h1 className="font-heading text-3xl font-semibold">دخولي</h1>
          <p className="text-sm text-muted-foreground">
            الموبايل أو الإيميل اللي سجّلتي بيهم. الحساب محفوظ على الجهاز ده للتجربة —
            مفيش سيرفر دخول لسه.
          </p>
        </div>
        <form
          className="rise-2 space-y-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10"
          onSubmit={(e) => {
            e.preventDefault();
            const msg = login(id, password);
            if (msg) {
              setErr(msg);
              return;
            }
            toast.success("أهلًا بيكي");
            router.push("/plan");
          }}
        >
          <label className="block space-y-1 text-sm">
            موبايل أو إيميل
            <Input
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoComplete="username"
              className="h-11"
              required
            />
          </label>
          <label className="block space-y-1 text-sm">
            الباسورد
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="h-11"
              required
            />
          </label>
          {err ? <p className="text-sm text-destructive">{err}</p> : null}
          <button type="submit" className={cn(buttonVariants(), "h-11 w-full")}>
            دخولي
          </button>
        </form>
        <p className="text-sm text-muted-foreground">
          لسه من غير حساب؟{" "}
          <Link href="/register" className="text-primary underline">
            سجّلي بيانات الفرح
          </Link>
        </p>
        <Button variant="ghost" nativeButton={false} render={<Link href="/" />} className="px-0">
          الرجوع للرئيسية
        </Button>
      </div>
    </div>
  );
}
