import { Brain, Layers, TrendingUp, MessageSquareCode, FileSpreadsheet, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI Sentiment Analysis",
    description: "Automatically evaluate positive, neutral, and negative sentiment across thousands of user feedback channels in real-time.",
    badge: "OpenAI Powered",
  },
  {
    icon: Layers,
    title: "Theme Detection",
    description: "Cluster feedback into recurring themes (UX, Performance, Pricing, Support) to pinpoint root causes automatically.",
    badge: "Auto Discovery",
  },
  {
    icon: TrendingUp,
    title: "Emerging Trends",
    description: "Detect sudden spikes or shifts in customer sentiment before they impact retention or product reviews.",
    badge: "Real-time Alerts",
  },
  {
    icon: MessageSquareCode,
    title: "LOOP AI Assistant",
    description: "Ask natural language questions about your feedback database and get immediate AI summaries with direct quotes.",
    badge: "Conversational",
  },
  {
    icon: FileSpreadsheet,
    title: "Voice-of-Customer Reports",
    description: "Generate polished, executive-ready PDF & CSV reports highlighting critical user feedback insights.",
    badge: "Automated Reports",
  },
  {
    icon: BarChart3,
    title: "Interactive Analytics",
    description: "Transform unstructured text reviews into quantitative dashboards, timelines, and satisfaction scores.",
    badge: "Custom Dashboards",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 bg-slate-50/50 dark:bg-slate-950/50 border-y border-border/50">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-left space-y-4 mb-16 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Everything You Need To Understand Your Customers
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            LOOP bridges the gap between raw customer text and strategic product roadmap decisions.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="glass-card glass-card-hover relative p-2 overflow-hidden group text-left"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {feature.badge}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
