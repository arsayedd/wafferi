import { ExternalLink, Globe, MapPin, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { WebHit } from "@/lib/web-search";

const kindLabel: Record<WebHit["kind"], string> = {
  web: "ويب",
  knowledge: "معرفة",
  place: "مكان",
};

export function WebResultCard({ hit }: { hit: WebHit }) {
  const Icon = hit.kind === "place" ? MapPin : hit.kind === "knowledge" ? BookOpen : Globe;
  return (
    <Card className="h-full py-0">
      <a href={hit.url} target="_blank" rel="noreferrer" className="block">
        {hit.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hit.image}
            alt=""
            className="aspect-[4/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-primary/15 to-muted text-primary">
            <Icon className="size-12 opacity-80" strokeWidth={1.3} />
          </div>
        )}
      </a>
      <CardContent className="flex flex-1 flex-col gap-2 pt-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted-foreground">{hit.host || hit.source}</span>
          <Badge variant="secondary">{kindLabel[hit.kind]}</Badge>
        </div>
        <a
          href={hit.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium leading-snug hover:underline"
        >
          {hit.title}
        </a>
        <p className="line-clamp-3 text-sm text-muted-foreground">{hit.snippet}</p>
        <p className="text-xs text-muted-foreground">{hit.source} · معروض بشكل وفّري</p>
      </CardContent>
      <CardFooter>
        <Button
          size="sm"
          className="w-full"
          nativeButton={false}
          render={<a href={hit.url} target="_blank" rel="noreferrer" />}
        >
          <ExternalLink />
          افتحي المصدر
        </Button>
      </CardFooter>
    </Card>
  );
}
