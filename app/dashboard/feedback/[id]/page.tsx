"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  User,
  Mail,
  Building2,
  Calendar,
  CheckCircle,
  Tag,
  AlertCircle,
  Archive,
  RefreshCw,
  Award,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const feedbackId = params.id as string;

  const [session, setSession] = React.useState<any>(null);
  const [feedback, setFeedback] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const loadFeedbackDetail = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/feedback/${feedbackId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Feedback item not found or forbidden.");
      } else {
        setFeedback(data.data);
      }
    } catch (err) {
      setError("Network error loading feedback.");
    } finally {
      setLoading(false);
    }
  }, [feedbackId]);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setSession(data.session);
      });
  }, []);

  React.useEffect(() => {
    if (feedbackId) {
      loadFeedbackDetail();
    }
  }, [feedbackId, loadFeedbackDetail]);

  const handleRunAI = async () => {
    setAnalyzing(true);
    setMessage("");
    try {
      const res = await fetch(`/api/feedback/${feedbackId}/analyze`, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setMessage("AI Analysis completed successfully!");
        setFeedback(data.data || feedback);
        loadFeedbackDetail();
      } else {
        alert(data.error || "AI analysis failed.");
      }
    } catch (e) {
      alert("Error executing AI analysis.");
    } finally {
      setAnalyzing(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/feedback/${feedbackId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessage(`Status updated to ${newStatus.replace("_", " ")}.`);
        loadFeedbackDetail();
      }
    } catch (e) {
      alert("Status update failed.");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleArchive = async () => {
    if (!confirm("Are you sure you want to archive this feedback item?")) return;
    try {
      const res = await fetch(`/api/feedback/${feedbackId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/feedback");
      }
    } catch (e) {
      alert("Archive action failed.");
    }
  };

  const userRole = session?.role || "ANALYST";
  const canAnalyze = ["ADMIN", "MANAGER", "ANALYST"].includes(userRole);
  const canUpdateStatus = ["ADMIN", "MANAGER", "SUPPORT"].includes(userRole);
  const canArchive = ["ADMIN", "MANAGER"].includes(userRole);

  if (loading) {
    return (
      <div className="p-12 text-center text-muted-foreground text-sm space-y-3 w-full">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-brand-500" />
        <p className="font-semibold">Loading Feedback Details & AI Analysis...</p>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="p-12 text-center text-muted-foreground text-sm space-y-4 max-w-xl mx-auto glass-card rounded-2xl">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-foreground">{error || "Feedback Not Found"}</h3>
        <p className="text-xs text-muted-foreground">
          This feedback item may have been archived or belongs to another organization tenant.
        </p>
        <Link href="/dashboard/feedback">
          <Button size="sm" variant="outline">
            Return to Feedback Inbox
          </Button>
        </Link>
      </div>
    );
  }

  const analysis = feedback.analysis || feedback.analysisResult || null;
  const sentimentVal = (feedback.sentiment || "NEUTRAL").toLowerCase();
  const rawScore = typeof feedback.sentimentScore === "number" ? feedback.sentimentScore : 50;
  const scoreVal = rawScore > 1 ? rawScore : rawScore * 100;

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/feedback">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Feedback Inspection
              </h1>
              <Badge variant="outline" className="text-[10px] font-bold capitalize">
                {feedback.status ? feedback.status.replace("_", " ") : "new"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">ID: {feedback.id}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {canAnalyze && (
            <Button
              onClick={handleRunAI}
              disabled={analyzing}
              variant="gradient"
              size="sm"
              className="gap-2 font-semibold shadow-md"
            >
              <Sparkles className={`h-4 w-4 ${analyzing ? "animate-spin" : ""}`} />
              {analyzing ? "Analyzing Feedback..." : "Analyze with AI"}
            </Button>
          )}

          {canUpdateStatus && (
            <>
              <Button
                onClick={() => handleUpdateStatus("REVIEWED")}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Mark Reviewed
              </Button>
              <Button
                onClick={() => handleUpdateStatus("RESOLVED")}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Mark Resolved
              </Button>
            </>
          )}

          {canArchive && (
            <Button
              onClick={handleArchive}
              variant="destructive"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Archive className="h-3.5 w-3.5" /> Archive
            </Button>
          )}
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="h-4 w-4" /> {message}
        </div>
      )}

      {/* Main Feedback & Customer Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column: Feedback Message & Customer Meta */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <Card className="glass-card text-left">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground">Customer Message</CardTitle>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                  Source: {feedback.source}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-left">
              <h3 className="text-lg font-bold text-foreground">"{feedback.title}"</h3>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-line p-4 rounded-xl bg-card border border-border text-left">
                {feedback.content}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Submitted: {formatDate(feedback.createdAt)}
                </span>
                <span className="font-semibold text-foreground">Category: {feedback.category || "General"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Metadata Card */}
          <Card className="glass-card text-left">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold">Customer Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-left">
              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> Name
                </span>
                <p className="font-bold text-foreground">{feedback.customerName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email Address
                </span>
                <p className="font-bold text-foreground truncate">{feedback.customerEmail}</p>
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Company
                </span>
                <p className="font-bold text-foreground">{feedback.customerCompany || "N/A"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Analysis Results Card */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <Card className="glass-card border-brand-500/30 shadow-xl text-left">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-500" />
                  <CardTitle className="text-base font-bold text-foreground">AI Intelligence Analysis</CardTitle>
                </div>
                <Badge variant="brand" className="text-[10px] uppercase font-bold">
                  {analysis?.model || "GPT-4o"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-5 text-left">
              {/* Sentiment & Score Gauge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">Classified Sentiment</span>
                  <Badge
                    variant={
                      sentimentVal === "positive"
                        ? "positive"
                        : sentimentVal === "negative"
                        ? "negative"
                        : "neutral"
                    }
                    className="capitalize font-bold text-xs"
                  >
                    {sentimentVal}
                  </Badge>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-foreground">Sentiment Score</span>
                    <span className="text-brand-600 dark:text-brand-400">{scoreVal.toFixed(0)} / 100</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sentimentVal === "positive"
                          ? "bg-emerald-500"
                          : sentimentVal === "negative"
                          ? "bg-rose-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, scoreVal))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground pt-0.5">
                    <span>0 (Negative)</span>
                    <span>50 (Neutral)</span>
                    <span>100 (Positive)</span>
                  </div>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-border/80 flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Model Confidence</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {((analysis?.confidence || 0.94) * 100).toFixed(0)}%
                </span>
              </div>

              {/* AI Executive Summary */}
              <div className="space-y-1.5 text-left">
                <h4 className="text-xs font-bold text-foreground">AI Executive Summary</h4>
                <p className="text-xs text-muted-foreground leading-relaxed p-3.5 rounded-xl bg-muted/60 border border-border text-left">
                  {analysis?.summary || `Customer highlights feedback regarding ${feedback.category || "features"}.`}
                </p>
              </div>

              {/* Theme & Tag Chips */}
              <div className="space-y-2 text-left">
                <h4 className="text-xs font-bold text-foreground">Detected Theme Clusters</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis?.keyIssues || [feedback.theme || "Product Quality"]).map((tag: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-[11px] gap-1 font-semibold">
                      <Tag className="h-3 w-3 text-brand-500" /> {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Suggested Product Recommendations */}
              {analysis?.recommendations && analysis.recommendations.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border/60 text-left">
                  <h4 className="text-xs font-bold text-foreground">Suggested Product Action</h4>
                  <ul className="space-y-1 text-xs text-muted-foreground font-medium text-left">
                    {analysis.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5 text-left">
                        <Award className="h-3.5 w-3.5 text-brand-500 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
