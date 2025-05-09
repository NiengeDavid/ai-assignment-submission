import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardData {
  title: string;
  description: string;
  value: string;
  trendValue: string;
  footerText: string;
  footerDescription?: string;
}

interface SectionCardsProps {
  data: CardData[];
}

export function SectionCards({ data }: SectionCardsProps) {
  return (
    <div className="*:data-[slot=card]:bg-card dark:*:data-[slot=card]:bg-bg1 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-3">
      {data?.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription className="font-semibold text-lg dark:text-white">{card.description}</CardDescription>
            <CardTitle className="text-5xl font-semibold tabular-nums @[250px]/card:text-6xl">
              {card.value}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.footerText}
            </div>
            <div className="text-muted-foreground">
              {card?.footerDescription || ""}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
