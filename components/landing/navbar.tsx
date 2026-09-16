"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="w-full flex h-16 items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            LOOP<span className="text-brand-600 dark:text-brand-400">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#product" className="hover:text-foreground transition-colors">Product</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <Link href="/dashboard/analytics" className="hover:text-foreground transition-colors">Analytics</Link>
          <Link href="/dashboard/ai" className="hover:text-foreground transition-colors">AI Intelligence</Link>
          <Link href="/dashboard/reports" className="hover:text-foreground transition-colors">Reports</Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="font-medium">Log In</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="gradient" className="gap-2 font-medium">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3 font-medium text-base text-left">
            <a href="#product" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-brand-600">Product</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-brand-600">Features</a>
            <Link href="/dashboard/analytics" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-brand-600">Analytics</Link>
            <Link href="/dashboard/ai" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-brand-600">AI Intelligence</Link>
            <Link href="/dashboard/reports" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-brand-600">Reports</Link>
          </nav>
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">Log In</Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gradient" className="w-full justify-start pl-6">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
