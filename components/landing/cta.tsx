import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingCTA() {
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-950 text-white border-t border-brand-800/40">
      <div className="w-full px-6 sm:px-8 lg:px-12 text-left relative z-10 max-w-4xl space-y-6">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          Turn customer voices into your next business decision.
        </h2>
        <p className="text-brand-200/80 text-lg sm:text-xl leading-relaxed">
          Start identifying high-impact issues, boosting customer satisfaction, and unifying feedback today with LOOP AI.
        </p>
        <div className="pt-4 flex justify-start">
          <Link href="/dashboard">
            <Button size="lg" variant="gradient" className="gap-2 text-base px-8 py-6 shadow-2xl">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
