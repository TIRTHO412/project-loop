"use client";

import * as React from "react";
import { MessageSquare, Star, Filter, ExternalLink, Sparkles, CheckCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { mockFeedbackList } from "@/lib/db/seed-data";
import { FeedbackItem, SentimentType } from "@/types";
import { formatDate } from "@/lib/utils";

export function FeedbackFeed() {
  const [selectedSentiment, setSelectedSentiment] = React.useState<SentimentType | "all">("all");
  const [selectedItem, setSelectedItem] = React.useState<FeedbackItem | null>(null);
  const [items, setItems] = React.useState<FeedbackItem[]>(mockFeedbackList);

  const filteredItems = items.filter((item) => {
    if (selectedSentiment === "all") return true;
    return item.sentiment === selectedSentiment;
  });

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-foreground">Recent Customer Feedback</CardTitle>
            <Badge variant="brand" className="text-[10px]">{filteredItems.length} entries</Badge>
          </div>
          <CardDescription className="text-xs">Real-time incoming customer feedback across connected channels</CardDescription>
        </div>

        {/* Sentiment Filters */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg text-xs font-semibold shrink-0">
          <button
            onClick={() => setSelectedSentiment("all")}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedSentiment === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedSentiment("positive")}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedSentiment === "positive" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold" : "text-muted-foreground"
            }`}
          >
            Positive
          </button>
          <button
            onClick={() => setSelectedSentiment("neutral")}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedSentiment === "neutral" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold" : "text-muted-foreground"
            }`}
          >
            Neutral
          </button>
          <button
            onClick={() => setSelectedSentiment("negative")}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedSentiment === "negative" ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-muted-foreground"
            }`}
          >
            Negative
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0 divide-y divide-border/60">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm space-y-2">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground/50" />
            <p className="font-semibold">No feedback entries match this filter.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="p-4 sm:p-5 hover:bg-muted/40 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge
                    variant={
                      item.sentiment === "positive"
                        ? "positive"
                        : item.sentiment === "negative"
                        ? "negative"
                        : "neutral"
                    }
                    className="capitalize text-[10px]"
                  >
                    {item.sentiment} ({(item.sentimentScore * 100).toFixed(0)}%)
                  </Badge>

                  <span className="font-medium text-foreground">{item.customerName}</span>
                  {item.customerCompany && (
                    <span className="text-muted-foreground">• {item.customerCompany}</span>
                  )}
                  <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    {item.source}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  "{item.title}"
                </h4>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground">{formatDate(item.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>

      {/* Detail Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title="Feedback Inspection & AI Analysis"
        >
          <div className="space-y-4 text-sm">
            <div className="p-3.5 rounded-xl bg-muted/60 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{selectedItem.customerName} ({selectedItem.customerEmail})</span>
                <span className="font-mono text-muted-foreground">{selectedItem.source}</span>
              </div>
              <p className="text-xs text-muted-foreground">{selectedItem.customerCompany || "Independent Customer"}</p>
            </div>

            <div>
              <h4 className="font-bold text-base text-foreground mb-1">"{selectedItem.title}"</h4>
              <p className="text-muted-foreground leading-relaxed text-sm bg-card p-3 rounded-lg border border-border">
                {selectedItem.content}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold text-xs">
                  <Sparkles className="h-3.5 w-3.5" /> AI Theme Categorization
                </div>
                <p className="text-xs font-bold text-foreground">{selectedItem.theme}</p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                  <CheckCircle className="h-3.5 w-3.5" /> Action Status
                </div>
                <p className="text-xs font-bold capitalize text-foreground">{selectedItem.status.replace("_", " ")}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelectedItem(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}
