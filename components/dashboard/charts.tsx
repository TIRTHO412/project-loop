"use client";

import * as React from "react";
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
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { timeSeriesData, sentimentDistribution, themeMetrics } from "@/lib/db/seed-data";

export function FeedbackVolumeChart() {
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "90d">("30d");

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-bold text-foreground">Feedback Volume Over Time</CardTitle>
          <CardDescription className="text-xs">Daily feedback submissions stream across all channels</CardDescription>
        </div>
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              timeRange === "7d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            7d
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              timeRange === "30d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            30d
          </button>
          <button
            onClick={() => setTimeRange("90d")}
            className={`px-2.5 py-1 rounded-md transition-all ${
              timeRange === "90d" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            90d
          </button>
        </div>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="total" stroke="#3b72ff" strokeWidth={2.5} fillOpacity={1} fill="url(#totalColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SentimentDonutChart() {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-foreground">Sentiment Distribution</CardTitle>
        <CardDescription className="text-xs">Overall positive, neutral, and negative ratio</CardDescription>
      </CardHeader>
      <CardContent className="h-72 flex flex-col items-center justify-center relative">
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={sentimentDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {sentimentDistribution.map((entry, index) => (
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

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs font-semibold pt-2">
          {sentimentDistribution.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-foreground">{item.name}:</span>
              <span className="text-muted-foreground">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SentimentTrendChart() {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-foreground">Sentiment Trajectory</CardTitle>
        <CardDescription className="text-xs">Comparative trend across positive, neutral & negative ratings</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            <Bar dataKey="positive" name="Positive" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="neutral" name="Neutral" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="negative" name="Negative" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TopCustomerThemesChart() {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-foreground">Top Customer Themes</CardTitle>
        <CardDescription className="text-xs">Volume of feedback categorized by automated theme clustering</CardDescription>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={themeMetrics}
            margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="theme"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" name="Feedback Count" fill="#3b72ff" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
