import { TrendingDown, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SavingsHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  toolCount: number;
}

export default function SavingsHero({
  totalMonthlySavings,
  totalAnnualSavings,
  isHighSavings,
  toolCount,
}: SavingsHeroProps) {
  if (totalMonthlySavings > 0) {
    return (
      <Card className="overflow-hidden rounded-2xl border-stone-200 shadow-sm">
        <div className="h-1 bg-primary" />
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent">
            <TrendingDown className="h-5 w-5 text-primary" />
          </div>
          <CardDescription className="uppercase tracking-widest">
            Potential savings
          </CardDescription>
          <CardTitle className="text-5xl font-bold tabular-nums text-primary sm:text-6xl">
            ${totalMonthlySavings.toLocaleString()}
            <span className="mt-1 block text-xl font-medium text-muted-foreground sm:text-2xl">
              per month
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg text-muted-foreground">
            <span className="font-semibold text-foreground">
              ${totalAnnualSavings.toLocaleString()}
            </span>{" "}
            per year
          </p>
          {isHighSavings && (
            <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
              High savings found
            </Badge>
          )}
          <p className="text-sm text-muted-foreground">
            Across {toolCount} tool{toolCount === 1 ? "" : "s"} analyzed
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-stone-200 shadow-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent">
          <CheckCircle2 className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-primary sm:text-3xl">
          Stack optimized
        </CardTitle>
        <CardDescription>
          Your AI tools look right-sized for your team
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          Across {toolCount} tool{toolCount === 1 ? "" : "s"} analyzed
        </p>
      </CardContent>
    </Card>
  );
}
