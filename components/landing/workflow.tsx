import { Inbox, Cpu, Sparkles, Rocket } from "lucide-react";

const workflowSteps = [
  {
    step: "01",
    title: "Collect",
    icon: Inbox,
    description: "Sync customer feedback seamlessly from Intercom, Zendesk, G2, Trustpilot, App Stores, and custom webhooks into a unified stream.",
  },
  {
    step: "02",
    title: "Analyze",
    icon: Cpu,
    description: "LOOP's AI engines process feedback text in real-time, assigning sentiment scores (0.0 - 1.0) and extracting key issue tags.",
  },
  {
    step: "03",
    title: "Understand",
    icon: Sparkles,
    description: "Automated algorithms cluster similar issues into recurring themes, detecting emerging trends and priority anomalies.",
  },
  {
    step: "04",
    title: "Act",
    icon: Rocket,
    description: "Empower product & engineering teams with AI summaries and Voice-of-Customer reports to ship high-impact improvements.",
  },
];

export function LandingWorkflow() {
  return (
    <section className="py-20 bg-background">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        
        <div className="text-left space-y-4 mb-16 max-w-4xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Automated Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            How LOOP Powers Feedback Intelligence
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            From raw customer messages to strategic execution in 4 seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {workflowSteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative flex flex-col items-start p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-sm hover:border-brand-500/40 transition-all duration-300 text-left">
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-800">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
