import { searchPlaces } from "@/lib/places-search";

export function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  return Response.json(searchPlaces(q));
}
