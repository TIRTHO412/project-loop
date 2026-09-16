import Link from "next/link";
import { Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground py-12">
      <div className="w-full px-6 sm:px-8 lg:px-12 text-left">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">LOOP</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              AI Customer Feedback Intelligence Platform. Turn customer feedback into actionable business insights.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} LOOP Intelligence Inc. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground">Features</a></li>
              <li><Link href="/dashboard/analytics" className="hover:text-foreground">Analytics</Link></li>
              <li><Link href="/dashboard/ai" className="hover:text-foreground">LOOP AI Assistant</Link></li>
              <li><Link href="/dashboard/reports" className="hover:text-foreground">Voice-of-Customer Reports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#docs" className="hover:text-foreground">Documentation</a></li>
              <li><a href="#api" className="hover:text-foreground">API Reference</a></li>
              <li><a href="#github" className="hover:text-foreground">GitHub</a></li>
              <li><a href="#changelog" className="hover:text-foreground">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground">About Us</a></li>
              <li><a href="#contact" className="hover:text-foreground">Contact Support</a></li>
              <li><a href="#privacy" className="hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-foreground">Terms of Service</a></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
