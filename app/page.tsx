import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingWorkflow } from "@/components/landing/workflow";
import { LandingDashboardPreview } from "@/components/landing/dashboard-preview";
import { LandingSecurity } from "@/components/landing/security";
import { LandingCTA } from "@/components/landing/cta";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-500 selection:text-white">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingDashboardPreview />
        <LandingFeatures />
        <LandingWorkflow />
        <LandingSecurity />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
