"use client";

import * as React from "react";
import { Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EmergingTrendsPage() {
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setSession(data.session);
      });
  }, []);

  const orgName = session?.organizationName || "Acme Cloud Inc.";

  const trendData = [
    { theme: "Performance & Load Times", category: "Performance", count: 482, prevCount: 419, change: "+15%", sentiment: 78, status: "Rising Issue" },
    { theme: "Customer Support Speed", category: "Support", count: 394, prevCount: 322, change: "+22%", sentiment: 92, status: "High Satisfaction" },
    { theme: "Pricing & Tier Flexibility", category: "Pricing", count: 310, prevCount: 323, change: "-4%", sentiment: 45, status: "Objection Risk" },
    { theme: "UI / Mobile Responsiveness", category: "UX", count: 288, prevCount: 266, change: "+8%", sentiment: 81, status: "Stable Trend" },
    { theme: "Feature Request: Slack Sync", category: "Feature Requests", count: 245, prevCount: 218, change: "+12%", sentiment: 88, status: "Top Feature Demand" },
  ];

  return (
    <div className="space-y-6 w-full text-left">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Emerging Customer Trends
          </h1>
          <Badge variant="brand" className="gap-1 text-[10px] uppercase font-bold">
            <Sparkles className="h-3 w-3" /> Auto Cluster
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Detect shifts in theme frequency, sentiment trajectories, and priority anomalies for {orgName}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {trendData.map((item, idx) => {
          const isPositiveChange = item.change.startsWith("+");

          return (
            <Card key={idx} className="glass-card hover:shadow-lg transition-all duration-200 text-left">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">
                    {item.category}
                  </Badge>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    {item.status}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-foreground mt-2">{item.theme}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-left">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-foreground">{item.count}</span>
                    <span className="text-xs text-muted-foreground ml-1">recent items</span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      isPositiveChange
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isPositiveChange ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {item.change} vs prev month
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Theme Sentiment Score</span>
                    <span className="text-foreground">{item.sentiment} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.sentiment >= 70 ? "bg-emerald-500" : item.sentiment >= 50 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${item.sentiment}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
