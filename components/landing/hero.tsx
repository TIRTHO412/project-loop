"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Subtle Gradient Blobs */}
      <div className="pointer-events-none absolute left-0 top-0 -z-10 blur-3xl opacity-30 dark:opacity-20">
        <div className="h-[450px] w-[900px] bg-gradient-to-tr from-brand-500 via-indigo-500 to-purple-600 rounded-full" />
      </div>

      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start text-left max-w-5xl space-y-8">
          
          {/* Tagline Badge */}
          <Badge variant="brand" className="px-4 py-1.5 text-xs sm:text-sm gap-2 rounded-full border-brand-500/30">
            <Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400 animate-pulse" />
            AI Customer Feedback Intelligence Platform
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Turn Customer Feedback Into{" "}
            <span className="gradient-text">Business Intelligence.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
            LOOP helps product & customer teams collect, understand, and act on feedback using AI-powered sentiment analysis, theme discovery, trend tracking, and Voice-of-Customer intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 w-full sm:w-auto pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="gradient" className="w-full sm:w-auto gap-2 text-base px-8 py-6 shadow-xl shadow-brand-500/25">
                Start Analyzing Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base px-8 py-6">
                <Play className="h-4 w-4 fill-current text-brand-600 dark:text-brand-400" />
                View Live Demo
              </Button>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-start gap-6 pt-4 text-xs sm:text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              5-minute setup
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              100+ integrations
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
