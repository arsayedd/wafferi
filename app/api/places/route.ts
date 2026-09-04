import { searchPlaces } from "@/lib/places-search";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  try {
    return Response.json(await searchPlaces(q));
  } catch {
    return Response.json(await searchPlaces(""));
  }
}
