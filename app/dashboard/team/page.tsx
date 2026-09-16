"use client";

import * as React from "react";
import { UserPlus, Lock, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockMembers = [
  { id: "m-1", name: "Alex Dev", email: "admin@loop.demo", role: "ADMIN", status: "Active", avatar: "AD" },
  { id: "m-2", name: "Maria Manager", email: "manager@loop.demo", role: "MANAGER", status: "Active", avatar: "MM" },
  { id: "m-3", name: "Sam Analyst", email: "analyst@loop.demo", role: "ANALYST", status: "Active", avatar: "SA" },
  { id: "m-4", name: "Taylor Support", email: "support@loop.demo", role: "SUPPORT", status: "Active", avatar: "TS" },
];

export default function TeamPage() {
  const [session, setSession] = React.useState<any>(null);
  const [members, setMembers] = React.useState(mockMembers);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setSession(data.session);
      });
  }, []);

  const isAdmin = session?.role === "ADMIN";
  const userRole = session?.role || "ANALYST";
  const orgName = session?.organizationName || "Acme Cloud Inc.";

  const handleRoleChange = (memberId: string, newRole: string) => {
    if (!isAdmin) {
      setMessage("Permission Denied: Only ADMINs can change member roles.");
      return;
    }
    setMembers(members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    setMessage("Role updated successfully.");
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <div className="space-y-6 w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Team Workspace & RBAC Roles
            </h1>
            <Badge variant="brand" className="uppercase font-bold text-[10px]">
              {userRole} Mode
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage organization members and assign RBAC roles (ADMIN, MANAGER, ANALYST, SUPPORT).
          </p>
        </div>

        {isAdmin ? (
          <Button
            onClick={() => setShowInviteModal(true)}
            variant="gradient"
            size="sm"
            className="gap-2 font-semibold shadow-md shrink-0"
          >
            <UserPlus className="h-4 w-4" /> Invite Team Member
          </Button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
            <Lock className="h-3.5 w-3.5" /> Read-Only Access (ADMIN required to modify team)
          </div>
        )}
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="h-4 w-4" /> {message}
        </div>
      )}

      {/* RBAC Rules Matrix Card */}
      <Card className="glass-card text-left">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-sm font-bold">Role Permission Matrix</CardTitle>
          <CardDescription className="text-xs">Server-enforced authorization scopes for {orgName}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-left">
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-border space-y-1 text-left">
            <span className="font-bold text-brand-600 dark:text-brand-400">ADMIN</span>
            <p className="text-muted-foreground text-[11px]">Full access: Manage team, roles, settings, AI & reports.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-border space-y-1 text-left">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">MANAGER</span>
            <p className="text-muted-foreground text-[11px]">Dashboard, feedback management, analytics, reports & AI.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-border space-y-1 text-left">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">ANALYST</span>
            <p className="text-muted-foreground text-[11px]">Feedback stream, analytics deep-dive, AI assistant.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-border space-y-1 text-left">
            <span className="font-bold text-amber-600 dark:text-amber-400">SUPPORT</span>
            <p className="text-muted-foreground text-[11px]">View permitted feedback, status updates & customer notes.</p>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card className="glass-card text-left">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-base font-bold">Workspace Members ({members.length})</CardTitle>
          <CardDescription className="text-xs">Scoped to Organization: {orgName}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border/60">
          {members.map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {member.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="h-8 px-2.5 rounded-lg border border-input bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ANALYST">ANALYST</option>
                    <option value="SUPPORT">SUPPORT</option>
                  </select>
                ) : (
                  <Badge variant="secondary" className="text-[11px] font-bold">
                    {member.role}
                  </Badge>
                )}
                <span className="text-xs text-emerald-500 font-semibold">{member.status}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
