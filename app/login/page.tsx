"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {
  const [email, setEmail] = React.useState("admin@loop.demo");
  const [password, setPassword] = React.useState("Password123!");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleQuickRoleDemo = async (roleEmail: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: roleEmail, password: "Password123!", isDemoMode: true }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "Demo mode login failed.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Demo mode login error.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <header className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">LOOP</span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <Card className="w-full max-w-md glass-card shadow-2xl rounded-2xl border border-border/80">
          <CardHeader className="space-y-2 text-center pb-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-2">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back to LOOP</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Enter your credentials to access your organization workspace
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Demo Roles selector for reviewer evaluation */}
            <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span className="text-xs font-semibold text-foreground">One-Click Demo Roles (Acme Cloud Inc.)</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickRoleDemo("admin@loop.demo")}
                  className="px-2 py-1.5 rounded-lg bg-card text-[11px] font-semibold text-foreground border border-border hover:border-brand-500 transition-colors text-left disabled:opacity-50"
                >
                  ⚡ Admin Role
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickRoleDemo("manager@loop.demo")}
                  className="px-2 py-1.5 rounded-lg bg-card text-[11px] font-semibold text-foreground border border-border hover:border-brand-500 transition-colors text-left disabled:opacity-50"
                >
                  💼 Manager Role
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickRoleDemo("analyst@loop.demo")}
                  className="px-2 py-1.5 rounded-lg bg-card text-[11px] font-semibold text-foreground border border-border hover:border-brand-500 transition-colors text-left disabled:opacity-50"
                >
                  📊 Analyst Role
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickRoleDemo("support@loop.demo")}
                  className="px-2 py-1.5 rounded-lg bg-card text-[11px] font-semibold text-foreground border border-border hover:border-brand-500 transition-colors text-left disabled:opacity-50"
                >
                  🎧 Support Role
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Or sign in with email
              </span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder="admin@loop.demo"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Password
                  </label>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder="••••••••••••"
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                disabled={isLoading}
                className="w-full h-10 font-semibold gap-2 shadow-lg shadow-brand-500/20"
              >
                {isLoading ? "Signing in..." : "Log In to Workspace"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-border pt-4 pb-6">
            <p className="text-xs text-muted-foreground">
              Don't have an account yet?{" "}
              <Link href="/signup" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      <footer className="py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LOOP Intelligence Platform
      </footer>
    </div>
  );
}
