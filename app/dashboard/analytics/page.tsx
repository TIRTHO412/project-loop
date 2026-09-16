"use client";

import * as React from "react";
import {
  BarChart3,
  Download,
  RefreshCw,
  Tag,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdvancedAnalyticsPage() {
  const [session, setSession] = React.useState<any>(null);
  const [timeframe, setTimeframe] = React.useState<"7d" | "30d" | "90d" | "year" | "all">("30d");
  const [analyticsData, setAnalyticsData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchAnalytics = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?timeframe=${timeframe}`);
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch analytics:", e);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setSession(data.session);
      });
  }, []);

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportCSV = () => {
    window.location.href = `/api/analytics/export?timeframe=${timeframe}`;
  };

  const orgName = session?.organizationName || "Acme Cloud Inc.";
  const kpis = analyticsData?.kpis;

  return (
    <div className="space-y-8 w-full text-left">
      {/* Header Bar & Date Range Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Advanced Feedback Analytics
            </h1>
            <Badge variant="brand" className="text-[10px] font-bold uppercase">
              {orgName}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time customer sentiment trajectories, theme breakdowns, and source metrics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl text-xs font-semibold">
            {(["7d", "30d", "90d", "year", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                  timeframe === t ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
                }`}
              >
                {t === "7d" ? "7 Days" : t === "30d" ? "30 Days" : t === "90d" ? "90 Days" : t === "year" ? "This Year" : "All Time"}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" /> Export Analytics CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground text-sm space-y-3 glass-card rounded-2xl">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-brand-500" />
          <p className="font-semibold">Calculating Multi-Tenant Analytics...</p>
        </div>
      ) : analyticsData?.isEmpty ? (
        /* Empty State */
        <Card className="glass-card p-12 text-center text-muted-foreground space-y-4">
          <BarChart3 className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">No Feedback Data Yet</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Add or import customer feedback entries to generate sentiment metrics and theme discoveries for {orgName}.
            </p>
          </div>
          <Button variant="gradient" size="sm" onClick={() => (window.location.href = "/dashboard/feedback/new")}>
            Add First Feedback
          </Button>
        </Card>
      ) : (
        <>
          {/* Top KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <Card className="glass-card p-5 space-y-2 text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Total Feedback</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-foreground">{kpis?.totalFeedback}</span>
                <Badge variant="brand" className="text-[10px]">{kpis?.hasHistoricalComparison ? "+12.4%" : "Live"}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Entries analyzed in timeframe</p>
            </Card>

            <Card className="glass-card p-5 space-y-2 text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Positive Sentiment</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-emerald-500">{kpis?.positivePercent}%</span>
                <span className="text-xs text-emerald-500 font-bold">{kpis?.positiveCount} items</span>
              </div>
              <p className="text-[11px] text-muted-foreground">High customer satisfaction</p>
            </Card>

            <Card className="glass-card p-5 space-y-2 text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase">CSAT Satisfaction</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-amber-500">{kpis?.csatScore}</span>
                <span className="text-xs text-emerald-500 font-bold">+0.3 pts</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Derived from 0-100 score model</p>
            </Card>

            <Card className="glass-card p-5 space-y-2 text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Open Action Items</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-foreground">{kpis?.openIssues}</span>
                <span className="text-xs text-rose-500 font-bold">{kpis?.negativeCount} negative</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Requiring product engineering review</p>
            </Card>
          </div>

          {/* Primary Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* Feedback Volume Over Time */}
            <div className="lg:col-span-8">
              <Card className="glass-card text-left">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Feedback Volume & Submission Flow</CardTitle>
                  <CardDescription className="text-xs">Daily customer feedback timeline over selected period ({timeframe})</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="volColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b72ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b72ff" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "#334155",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                      <Area type="monotone" dataKey="total" stroke="#3b72ff" strokeWidth={2.5} fillOpacity={1} fill="url(#volColor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Sentiment Donut Distribution */}
            <div className="lg:col-span-4">
              <Card className="glass-card text-left">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-foreground">Sentiment Breakdown</CardTitle>
                  <CardDescription className="text-xs">Positive, Neutral, and Negative distribution ratio</CardDescription>
                </CardHeader>
                <CardContent className="h-72 flex flex-col items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={analyticsData.sentimentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analyticsData.sentimentDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderColor: "#334155",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-4 text-xs font-semibold pt-2">
                    {analyticsData.sentimentDistribution.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-foreground">{item.name}:</span>
                        <span className="text-muted-foreground">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Secondary Visualizations & Theme Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* Theme Sentiment Breakdown Matrix Table */}
            <div className="lg:col-span-7">
              <Card className="glass-card text-left">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-base font-bold text-foreground">Top Themes & Sentiment Matrix</CardTitle>
                  <CardDescription className="text-xs">Themes sorted by volume and negative sentiment risk</CardDescription>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border/60">
                  {analyticsData.topThemes.map((t: any, idx: number) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors text-left">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5 text-brand-500" />
                          <span className="text-sm font-bold text-foreground">{t.theme}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t.count} items • {t.positiveCount} positive, {t.negativeCount} negative
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <span className="font-bold text-foreground">{t.sentimentScore} / 100</span>
                          <p className="text-[10px] text-muted-foreground">Score</p>
                        </div>
                        <Badge
                          variant={t.negativeCount > t.positiveCount ? "negative" : "positive"}
                          className="text-[10px] uppercase font-bold"
                        >
                          {t.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Feedback Sources Breakdown */}
            <div className="lg:col-span-5">
              <Card className="glass-card text-left">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-base font-bold text-foreground">Feedback by Source Channel</CardTitle>
                  <CardDescription className="text-xs">Volume distribution across integrations and manual inputs</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {analyticsData.sourcesBreakdown.map((s: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-foreground">{s.source}</span>
                        <span className="text-muted-foreground">{s.count} ({s.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${s.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
