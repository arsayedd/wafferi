import { networkStats } from "@/lib/network";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    at: Date.now(),
    mode: "partner-feeds",
    note: "الأسعار الحية على العميل من فيد CSV/JSON. مفيش سحب HTML للمتاجر.",
    network: networkStats(),
  });
}
