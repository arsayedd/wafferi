"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";

type State = { failed: boolean };

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="font-heading text-xl font-semibold">الصفحة وقفت لحظة</p>
          <p className="mt-2 text-sm text-muted-foreground">
            جرّبي تحديث الصفحة. إضافة الجهاز والبحث لسه على نفس الروابط.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
              onClick={() => this.setState({ failed: false })}
            >
              إعادة المحاولة
            </button>
            <Link href="/search" className="rounded-lg bg-muted px-4 py-2 text-sm">
              رجوع للبحث
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
