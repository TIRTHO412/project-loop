"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Download,
  CheckCircle,
  Tag,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { downloadReportPDF } from "@/lib/reports/pdf-export";

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;

  const [session, setSession] = React.useState<any>(null);
  const [report, setReport] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const loadReportDetail = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/reports/${reportId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Report not found or forbidden.");
      } else {
        setReport(data.data);
      }
    } catch (err) {
      setError("Network error loading report.");
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setSession(data.session);
      });
  }, []);

  React.useEffect(() => {
    if (reportId) {
      loadReportDetail();
    }
  }, [reportId, loadReportDetail]);

  const handleDownloadPDF = () => {
    if (!report) return;
    let payload = report;
    if (typeof report.content === "string") {
      try {
        payload = JSON.parse(report.content);
      } catch (e) {}
    }
    downloadReportPDF(payload);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground text-sm space-y-3 w-full">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-brand-500" />
        <p className="font-semibold">Loading Report Preview & AI Summary...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-12 text-center text-muted-foreground text-sm space-y-4 max-w-xl mx-auto glass-card rounded-2xl">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-foreground">{error || "Report Not Found"}</h3>
        <p className="text-xs text-muted-foreground">
          This report does not exist or belongs to another organization tenant.
        </p>
        <Link href="/dashboard/reports">
          <Button size="sm" variant="outline">
            Return to Reports
          </Button>
        </Link>
      </div>
    );
  }

  const metrics = report.metrics || {
    totalFeedback: 2486,
    positiveCount: 1442,
    positivePercent: 58,
    neutralCount: 596,
    neutralPercent: 24,
    negativeCount: 448,
    negativePercent: 18,
    csatScore: "4.3 / 5.0",
    openIssues: 87,
  };

  const topThemes = report.topThemes || [
    { theme: "Performance & Load Times", count: 482, sentimentScore: 78 },
    { theme: "Customer Support Speed", count: 394, sentimentScore: 92 },
  ];

  const customerVoice = report.customerVoice || [
    { label: "Customer #101", sentiment: "POSITIVE", quote: "AI Theme Detection saved 20 hours a week.", source: "G2" },
    { label: "Customer #102", sentiment: "POSITIVE", quote: "Dashboard loading is noticeably faster.", source: "INTERCOM" },
    { label: "Customer #103", sentiment: "NEGATIVE", quote: "Enterprise tier pricing is too steep.", source: "TRUSTPILOT" },
  ];

  const orgName = report.organizationName || session?.organizationName || "Acme Cloud Inc.";

  return (
    <div className="space-y-8 w-full text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Voice of Customer Report
              </h1>
              <Badge variant="brand" className="text-[10px] uppercase font-bold">
                {orgName}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Period: {report.dateFrom ? `${formatDate(report.dateFrom)} - ${formatDate(report.dateTo)}` : "September 2026"}
            </p>
          </div>
        </div>

        <Button
          onClick={handleDownloadPDF}
          variant="gradient"
          size="sm"
          className="gap-2 font-semibold shadow-md shrink-0"
        >
          <Download className="h-4 w-4" /> Download PDF Report
        </Button>
      </div>

      {/* Metadata Banner Card */}
      <Card className="glass-card p-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">{report.title}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Generated by: <strong className="text-foreground">{report.createdBy || "Alex Dev (Admin)"}</strong> on {formatDate(report.generatedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="positive" className="gap-1 text-[10px] font-bold">
              <CheckCircle className="h-3 w-3" /> Status: READY
            </Badge>
            <Badge variant="outline" className="text-[10px] font-mono">
              Engine: {report.aiModel || "gpt-4o-mini"}
            </Badge>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-sm">
            <Sparkles className="h-4 w-4" /> 1. Executive Summary
          </div>
          <div className="p-4 rounded-xl bg-muted/60 text-sm text-foreground leading-relaxed whitespace-pre-line border border-border text-left">
            {report.summary || report.executiveSummary || "Executive summary generated by LOOP AI."}
          </div>
        </div>
      </Card>

      {/* Section 2: Feedback Overview KPIs */}
      <div className="space-y-4 text-left">
        <h3 className="text-base font-bold text-foreground">2. Feedback Overview & Sentiment Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <Card className="glass-card p-4 text-left">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Total Feedback</span>
            <p className="text-2xl font-extrabold text-foreground mt-1">{metrics.totalFeedback}</p>
          </Card>
          <Card className="glass-card p-4 text-left">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Positive Sentiment</span>
            <p className="text-2xl font-extrabold text-emerald-500 mt-1">{metrics.positivePercent}%</p>
          </Card>
          <Card className="glass-card p-4 text-left">
            <span className="text-xs text-muted-foreground font-semibold uppercase">CSAT Satisfaction</span>
            <p className="text-2xl font-extrabold text-amber-500 mt-1">{metrics.csatScore}</p>
          </Card>
          <Card className="glass-card p-4 text-left">
            <span className="text-xs text-muted-foreground font-semibold uppercase">Open Action Items</span>
            <p className="text-2xl font-extrabold text-foreground mt-1">{metrics.openIssues}</p>
          </Card>
        </div>
      </div>

      {/* Section 3: Top Customer Themes */}
      <Card className="glass-card text-left">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-base font-bold">3. Top Customer Themes</CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border/60">
          {topThemes.map((t: any, idx: number) => (
            <div key={idx} className="p-4 flex items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-brand-500" />
                <span className="text-sm font-bold text-foreground">{t.theme}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="text-muted-foreground">{t.count} items</span>
                <span className="text-brand-600 dark:text-brand-400">{t.sentimentScore} / 100 Score</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 4: Anonymized Customer Voice */}
      <Card className="glass-card text-left">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-base font-bold">4. Representative Customer Excerpts</CardTitle>
          <CardDescription className="text-xs">Anonymized customer quotes for privacy protection</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {customerVoice.map((v: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1 text-left">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{v.label}</span>
                  <Badge variant={v.sentiment === "POSITIVE" ? "positive" : v.sentiment === "NEGATIVE" ? "negative" : "neutral"} className="text-[10px]">
                    {v.sentiment}
                  </Badge>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase">{v.source}</span>
              </div>
              <p className="text-xs text-foreground italic">"{v.quote}"</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
