import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KpiMetric } from "@/types";

interface KpiCardProps {
  metric: KpiMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const isPositive = metric.changeType === "positive";
  const isNegative = metric.changeType === "negative";

  return (
    <Card className="glass-card hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {metric.title}
        </p>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {metric.value}
          </span>
          <div
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : isNegative
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : isNegative ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            {metric.change}
          </div>
        </div>
        {metric.subtitle && (
          <p className="text-[11px] text-muted-foreground">{metric.subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
