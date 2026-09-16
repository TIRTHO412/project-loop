"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  BarChart3,
  Bot,
  FileSpreadsheet,
  Users,
  Layers,
  Settings,
  Sparkles,
  ChevronRight,
  X,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  session?: any;
}

const navSections = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { name: "Feedback Stream", href: "/dashboard/feedback", icon: MessageSquareText, badge: "Live" },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { name: "LOOP AI", href: "/dashboard/ai", icon: Bot, badge: "v2.0" },
      { name: "Reports", href: "/dashboard/reports", icon: FileSpreadsheet },
    ],
  },
  {
    title: "Workspace",
    items: [
      { name: "Team Members", href: "/dashboard/team", icon: Users },
      { name: "Integrations", href: "/dashboard/integrations", icon: Layers },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function DashboardSidebar({ mobileOpen, setMobileOpen, session }: SidebarProps) {
  const pathname = usePathname();

  const orgName = session?.organizationName || "Acme Cloud Inc.";
  const userName = session?.name || "Alex Dev";
  const userEmail = session?.email || "admin@loop.demo";
  const userRole = session?.role || "ADMIN";

  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const content = (
    <div className="flex flex-col h-full bg-card border-r border-border w-64 shrink-0">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            LOOP<span className="text-brand-600 dark:text-brand-400">.</span>
          </span>
        </Link>
        {mobileOpen && setMobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="md:hidden h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Organization Badge (Multi-Tenant Organization context) */}
      <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-border/60 flex items-center justify-between">
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-foreground truncate">{orgName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-500/15 text-brand-600 dark:text-brand-400 uppercase">
              {userRole}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">Workspace</span>
          </div>
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              {section.title}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
                      isActive
                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-4 w-4", isActive ? "text-brand-600 dark:text-brand-400" : "text-muted-foreground group-hover:text-foreground")} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-500/15 text-brand-600 dark:text-brand-400">
                        {item.badge}
                      </span>
                    ) : (
                      isActive && <ChevronRight className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Profile Mini Summary */}
      <div className="p-4 border-t border-border flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
          <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs animate-in slide-in-from-left duration-200 h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
