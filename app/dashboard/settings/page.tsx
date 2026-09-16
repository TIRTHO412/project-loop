"use client";

import * as React from "react";
import { Settings, Shield, Building2, User } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setSession(data.session);
      });
  }, []);

  const userName = session?.name || "Alex Dev";
  const userEmail = session?.email || "admin@loop.demo";
  const userRole = session?.role || "ADMIN";
  const orgName = session?.organizationName || "Acme Cloud Inc.";
  const orgSlug = session?.organizationSlug || "acme-cloud-inc";

  return (
    <div className="space-y-6 w-full text-left">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your organization profile, security policies, and team defaults.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        <div className="lg:col-span-6 space-y-6">
          <Card className="glass-card text-left">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand-500" /> Organization Profile
                </CardTitle>
                <Badge variant="brand" className="text-[10px] uppercase font-bold">{session?.role || "ADMIN"}</Badge>
              </div>
              <CardDescription className="text-xs">General workspace details</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs text-left">
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Organization Name</span>
                <input
                  type="text"
                  readOnly
                  value={orgName}
                  className="w-full h-9 px-3 rounded-lg border border-input bg-muted/50 text-foreground font-bold"
                />
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Workspace Slug</span>
                <input
                  type="text"
                  readOnly
                  value={orgSlug}
                  className="w-full h-9 px-3 rounded-lg border border-input bg-muted/50 font-mono text-muted-foreground"
                />
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Plan Subscription</span>
                <p className="font-bold text-emerald-500">PRO Plan (Active)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <Card className="glass-card text-left">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="h-4 w-4 text-brand-500" /> Account Profile
              </CardTitle>
              <CardDescription className="text-xs">Your personal authenticated profile</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs text-left">
              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Full Name</span>
                <input
                  type="text"
                  readOnly
                  value={userName}
                  className="w-full h-9 px-3 rounded-lg border border-input bg-muted/50 text-foreground font-bold"
                />
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Work Email</span>
                <input
                  type="text"
                  readOnly
                  value={userEmail}
                  className="w-full h-9 px-3 rounded-lg border border-input bg-muted/50 text-foreground font-bold"
                />
              </div>

              <div className="space-y-1">
                <span className="text-muted-foreground font-semibold">Assigned Role</span>
                <p className="font-bold text-brand-600 dark:text-brand-400">{userRole}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
