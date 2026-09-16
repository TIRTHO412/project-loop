"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Download, RefreshCw, Shield, Building2, UserCheck, FileSpreadsheet, Eye } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  FeedbackVolumeChart,
  SentimentDonutChart,
  SentimentTrendChart,
  TopCustomerThemesChart,
} from "@/components/dashboard/charts";
import { FeedbackFeed } from "@/components/dashboard/feedback-feed";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { initialKpis } from "@/lib/db/seed-data";

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setSession(data.session);
        }
      })
      .catch(() => {});
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const userName = session?.name || "Alex Dev";
  const orgName = session?.organizationName || "Acme Cloud Inc.";
  const roleName = session?.role || "ADMIN";

  return (
    <div className="space-y-8 w-full text-left">
      {/* Authenticated Welcome & Organization Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-900/60 via-indigo-950/60 to-slate-900/60 border border-brand-500/20 backdrop-blur-md text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {userName}
            </h1>
            <Badge variant="brand" className="gap-1 uppercase font-bold text-[10px]">
              <Shield className="h-3 w-3" /> {roleName}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-200/80 pt-1">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-brand-400" /> Organization: <strong className="text-white">{orgName}</strong>
            </span>
            <span className="flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-emerald-400" /> Active Authenticated Session
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2 text-xs font-semibold bg-background/50 border-white/10 text-white hover:bg-background/80"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Stream
          </Button>
          <Link href="/dashboard/reports">
            <Button variant="gradient" size="sm" className="gap-2 text-xs font-semibold shadow-md">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              View Voice-of-Customer Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Latest Voice-of-Customer Report Widget */}
      <Card className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-brand-500/20 text-left">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">Latest Voice-of-Customer Executive Report</h3>
              <Badge variant="brand" className="text-[9px] uppercase">Sep 2026</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              CSAT: 4.3 / 5.0 • 2,486 feedback items analyzed • Support velocity & performance optimization noted.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/dashboard/reports/rep-101">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs font-semibold">
              <Eye className="h-3.5 w-3.5" /> View Report
            </Button>
          </Link>
          <Link href="/dashboard/reports">
            <Button size="sm" variant="gradient" className="gap-1.5 text-xs font-semibold">
              <Download className="h-3.5 w-3.5" /> Reports Hub
            </Button>
          </Link>
        </div>
      </Card>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {initialKpis.map((metric, idx) => (
          <KpiCard key={idx} metric={metric} />
        ))}
      </div>

      {/* Primary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <FeedbackVolumeChart />
        </div>
        <div className="lg:col-span-4">
          <SentimentDonutChart />
        </div>
      </div>

      {/* Secondary Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <SentimentTrendChart />
        </div>
        <div className="lg:col-span-6">
          <TopCustomerThemesChart />
        </div>
      </div>

      {/* Recent Feedback Feed */}
      <FeedbackFeed />
    </div>
  );
}
