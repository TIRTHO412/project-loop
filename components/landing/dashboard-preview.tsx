"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LandingDashboardPreview() {
  return (
    <section id="product" className="py-20 bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-6 sm:px-8 lg:px-12 relative">
        
        <div className="text-left space-y-4 mb-14 max-w-4xl">
          <Badge variant="brand" className="bg-brand-500/20 text-brand-300 border-brand-500/30">
            Interactive Product Preview
          </Badge>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
            Designed For High-Growth Product Teams
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Experience an enterprise-grade dashboard built for speed, clarity, and instant executive decision making.
          </p>
        </div>

        {/* Dashboard Preview Shell */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-xl font-bold text-white">Live Feedback Stream</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">Organization: Acme Cloud Inc. • Last updated 2 minutes ago</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                100+ Seed Records Loaded
              </span>
              <Link href="/dashboard">
                <Button size="sm" variant="gradient" className="gap-1.5 text-xs">
                  Launch Interactive App
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
              <p className="text-xs text-slate-400 font-medium">Total Feedback</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold text-white">2,486</span>
                <span className="text-xs text-emerald-400 font-medium">+12.4%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
              <p className="text-xs text-slate-400 font-medium">Positive Sentiment</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold text-emerald-400">58%</span>
                <span className="text-xs text-emerald-400 font-medium">+4.2%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
              <p className="text-xs text-slate-400 font-medium">CSAT Satisfaction</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-bold text-amber-400">4.3 / 5</span>
                <span className="text-xs text-emerald-400 font-medium">+0.3</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
              <p className="text-xs text-slate-400 font-medium">Top Theme</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-bold text-brand-400 truncate">Performance</span>
                <span className="text-xs text-brand-300 font-medium">482 items</span>
              </div>
            </div>
          </div>

          {/* Sample Feedback Items */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900 transition-colors text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="positive" className="text-[10px]">Positive (96%)</Badge>
                  <span className="text-xs text-slate-400">TechCorp Global • G2 Review</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200">"AI Theme Detection saved our product team 20 hours a week"</h4>
              </div>
              <span className="text-xs text-slate-400 shrink-0">2 hours ago</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900 transition-colors text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" className="text-[10px]">Neutral (54%)</Badge>
                  <span className="text-xs text-slate-400">DesignHub • Email</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200">"Need custom CSV export options for monthly executive reports"</h4>
              </div>
              <span className="text-xs text-slate-400 shrink-0">5 hours ago</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
