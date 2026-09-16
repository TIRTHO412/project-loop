"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, Send, User, Mail, Building2, MessageSquare, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AddFeedbackPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    customerName: "",
    customerEmail: "",
    customerCompany: "",
    title: "",
    content: "",
    source: "MANUAL",
    category: "General",
    autoAnalyze: true,
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.customerName || !formData.customerEmail || !formData.content) {
      setError("Please fill in all required fields (Name, Email, Feedback Content).");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit feedback.");
        setIsLoading(false);
        return;
      }

      router.push(`/dashboard/feedback/${data.data.id || ""}`);
    } catch (err: any) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full text-left">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/feedback">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Collect New Customer Feedback
          </h1>
          <p className="text-xs text-muted-foreground">
            Submit customer feedback for automatic AI sentiment & theme analysis.
          </p>
        </div>
      </div>

      <Card className="glass-card text-left">
        <form onSubmit={handleSubmit}>
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-base font-bold">Feedback Details</CardTitle>
            <CardDescription className="text-xs">
              All entries are automatically scoped to your current organization tenant.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-4 text-left">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-muted-foreground" /> Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full h-10 px-3.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Customer Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  placeholder="e.g. sarah@company.com"
                  className="w-full h-10 px-3.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Company (Optional)
                </label>
                <input
                  type="text"
                  value={formData.customerCompany}
                  onChange={(e) => setFormData({ ...formData, customerCompany: e.target.value })}
                  placeholder="e.g. TechCorp"
                  className="w-full h-10 px-3.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Feedback Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                >
                  <option value="MANUAL">Manual Entry</option>
                  <option value="WEBSITE">Website Form</option>
                  <option value="EMAIL">Direct Email</option>
                  <option value="SURVEY">CSAT Survey</option>
                  <option value="G2">G2 Review</option>
                  <option value="INTERCOM">Intercom Chat</option>
                  <option value="ZENDESK">Zendesk Ticket</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Initial Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                >
                  <option value="General">General</option>
                  <option value="Performance & Speed">Performance & Speed</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Pricing & Plans">Pricing & Plans</option>
                  <option value="UX & Interface">UX & Interface</option>
                  <option value="Feature Requests">Feature Requests</option>
                  <option value="Bugs & Errors">Bugs & Errors</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-foreground">Feedback Headline / Summary Title (Optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief summary sentence..."
                className="w-full h-10 px-3.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" /> Full Feedback Message Content *
              </label>
              <textarea
                required
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Paste the raw customer feedback message text here..."
                className="w-full p-3 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50 leading-relaxed"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <div className="text-xs text-left">
                  <p className="font-semibold text-foreground">Auto-Run AI Sentiment & Theme Analysis</p>
                  <p className="text-muted-foreground">Classifies sentiment (0-100), extracts themes & generates summary on submit.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoAnalyze}
                onChange={(e) => setFormData({ ...formData, autoAnalyze: e.target.checked })}
                className="h-4 w-4 rounded accent-brand-600 cursor-pointer"
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/60 justify-between p-6">
            <Link href="/dashboard/feedback">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" variant="gradient" disabled={isLoading} className="gap-2 font-semibold shadow-md">
              <Send className="h-4 w-4" />
              {isLoading ? "Analyzing & Saving..." : "Submit Customer Feedback"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
