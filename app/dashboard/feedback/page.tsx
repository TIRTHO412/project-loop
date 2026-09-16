"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Upload,
  CheckCircle,
  Tag,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export default function FeedbackInboxPage() {
  const [session, setSession] = React.useState<any>(null);
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [sentimentFilter, setSentimentFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sourceFilter, setSourceFilter] = React.useState("all");

  // CSV Import Modal state
  const [csvModalOpen, setCsvModalOpen] = React.useState(false);
  const [csvText, setCsvText] = React.useState("");
  const [importing, setImporting] = React.useState(false);

  // Bulk AI Analysis state
  const [analyzingBulk, setAnalyzingBulk] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const fetchFeedback = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (sentimentFilter !== "all") params.set("sentiment", sentimentFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (sourceFilter !== "all") params.set("source", sourceFilter);

      const res = await fetch(`/api/feedback?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (e) {
      console.error("Failed to load feedback stream:", e);
    } finally {
      setLoading(false);
    }
  }, [search, sentimentFilter, statusFilter, sourceFilter]);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setSession(data.session);
      });
  }, []);

  React.useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    setImporting(true);
    try {
      const res = await fetch("/api/feedback/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawCsv: csvText }),
      });
      const data = await res.json();

      if (res.ok) {
        setToastMessage(`Successfully imported ${data.summary.successCount} feedback entries.`);
        setCsvModalOpen(false);
        setCsvText("");
        fetchFeedback();
      } else {
        alert(data.error || "Import failed.");
      }
    } catch (err) {
      alert("Error importing CSV.");
    } finally {
      setImporting(false);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const handleBulkAI = async () => {
    setAnalyzingBulk(true);
    try {
      const res = await fetch("/api/feedback/analyze-bulk", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setToastMessage(data.message || "Bulk AI analysis complete.");
        fetchFeedback();
      }
    } catch (e) {
      alert("Bulk analysis error.");
    } finally {
      setAnalyzingBulk(false);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const orgName = session?.organizationName || "Acme Cloud Inc.";

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Customer Feedback Inbox
            </h1>
            <Badge variant="brand" className="text-[10px] font-bold uppercase">
              {orgName}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Collect, search, filter, and inspect AI-analyzed customer feedback across all channels.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkAI}
            disabled={analyzingBulk}
            className="gap-2 text-xs font-semibold"
          >
            <Sparkles className={`h-3.5 w-3.5 text-brand-500 ${analyzingBulk ? "animate-spin" : ""}`} />
            {analyzingBulk ? "Analyzing..." : "Analyze Bulk AI"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCsvModalOpen(true)}
            className="gap-2 text-xs font-semibold"
          >
            <Upload className="h-3.5 w-3.5 text-indigo-500" />
            Import CSV
          </Button>

          <Link href="/dashboard/feedback/new">
            <Button variant="gradient" size="sm" className="gap-2 text-xs font-semibold shadow-md">
              <Plus className="h-4 w-4" /> Add Customer Feedback
            </Button>
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="h-4 w-4" /> {toastMessage}
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <Card className="glass-card p-4 space-y-4 text-left">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email, message, category, or theme..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <Button variant="ghost" size="sm" onClick={fetchFeedback} className="gap-1.5 text-xs font-semibold">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium pt-2 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> <span>Sentiment:</span>
          </div>
          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
            {["all", "positive", "neutral", "negative"].map((s) => (
              <button
                key={s}
                onClick={() => setSentimentFilter(s)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                  sentimentFilter === s ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground ml-2">
            <span>Status:</span>
          </div>
          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
            {["all", "new", "reviewed", "in_progress", "resolved", "archived"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-1 rounded-md capitalize text-[11px] transition-all ${
                  statusFilter === st ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground ml-2">
            <span>Source:</span>
          </div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-7 px-2 rounded-md bg-muted border border-transparent text-[11px] font-semibold text-foreground focus:outline-none"
          >
            <option value="all">All Sources</option>
            <option value="WEBSITE">Website</option>
            <option value="EMAIL">Email</option>
            <option value="SURVEY">Survey</option>
            <option value="CSV">CSV Import</option>
            <option value="MANUAL">Manual Entry</option>
            <option value="INTERCOM">Intercom</option>
            <option value="ZENDESK">Zendesk</option>
            <option value="G2">G2</option>
          </select>
        </div>
      </Card>

      {/* Inbox Data Feed Table */}
      <Card className="glass-card text-left">
        <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold">Feedback Entries ({items.length})</CardTitle>
            <CardDescription className="text-xs">Showing tenant-isolated items for {orgName}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-border/60">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground text-sm space-y-2">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto text-brand-500" />
              <p className="font-semibold">Loading Feedback Stream...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm space-y-3">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <div className="space-y-1">
                <p className="font-bold text-foreground text-base">No matching feedback found</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your search criteria or add your first customer review using the button above.
                </p>
              </div>
              <Link href="/dashboard/feedback/new">
                <Button size="sm" variant="gradient" className="gap-2">
                  <Plus className="h-4 w-4" /> Add First Feedback
                </Button>
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const sentimentVal = (item.sentiment || "NEUTRAL").toLowerCase();
              const scoreVal = typeof item.sentimentScore === "number" ? item.sentimentScore : 50;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group text-left"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge
                        variant={
                          sentimentVal === "positive"
                            ? "positive"
                            : sentimentVal === "negative"
                            ? "negative"
                            : "neutral"
                        }
                        className="capitalize text-[10px] font-bold"
                      >
                        {sentimentVal} ({scoreVal > 1 ? scoreVal.toFixed(0) : (scoreVal * 100).toFixed(0)}/100)
                      </Badge>

                      <span className="font-semibold text-foreground">{item.customerName}</span>
                      <span className="text-muted-foreground">({item.customerEmail})</span>
                      {item.customerCompany && (
                        <span className="text-muted-foreground">• {item.customerCompany}</span>
                      )}

                      <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono uppercase">
                        {item.source}
                      </span>
                    </div>

                    <Link href={`/dashboard/feedback/${item.id}`}>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors cursor-pointer">
                        "{item.title}"
                      </h4>
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>

                    {item.theme && (
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                        <Tag className="h-3 w-3" /> Theme: {item.theme}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {item.status ? item.status.replace("_", " ") : "new"}
                    </Badge>

                    <Link href={`/dashboard/feedback/${item.id}`}>
                      <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs">
                        Inspect & Analyze <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* CSV Import Modal */}
      {csvModalOpen && (
        <Modal
          isOpen={csvModalOpen}
          onClose={() => setCsvModalOpen(false)}
          title="Import Feedback from CSV"
        >
          <form onSubmit={handleCsvImport} className="space-y-4 text-sm text-left">
            <p className="text-xs text-muted-foreground">
              Paste CSV content with headers: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">customerName, customerEmail, message, source, category</code>
            </p>

            <textarea
              required
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={`customerName,customerEmail,message,source,category
Sarah Jenkins,sarah@techcorp.io,"Dashboard loads twice as fast now",G2,Performance
David Miller,david@fintech.com,"Need custom CSV export options",Email,Feature Request`}
              className="w-full p-3 rounded-xl border border-input bg-background font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCsvModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient" size="sm" disabled={importing} className="gap-2 font-semibold">
                <Upload className="h-3.5 w-3.5" />
                {importing ? "Importing & Analyzing..." : "Run CSV Import"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
