"use client";

import * as React from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [globalSearch, setGlobalSearch] = React.useState("");
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setSession(data.session);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar Navigation */}
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        session={session}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
          session={session}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
