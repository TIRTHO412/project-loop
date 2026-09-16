"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu, User, LogOut, SlidersHorizontal, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMobileMenuToggle: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  session?: any;
}

export function DashboardHeader({ onMobileMenuToggle, searchQuery, setSearchQuery, session }: HeaderProps) {
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: "n-1", title: "New Sentiment Trend Detected", desc: "Performance issues up +15% this week.", unread: true, time: "10m ago" },
    { id: "n-2", title: "Voice-of-Customer Report Ready", desc: "Monthly AI Executive Report for September is generated.", unread: true, time: "1h ago" },
    { id: "n-3", title: "Zendesk Webhook Connected", desc: "Synced 42 new support tickets automatically.", unread: false, time: "4h ago" },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (e) {
      router.push("/login");
    }
  };

  const userName = session?.name || "Alex Dev";
  const userEmail = session?.email || "admin@loop.demo";
  const userRole = session?.role || "ADMIN";
  const orgName = session?.organizationName || "Acme Cloud Inc.";

  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 h-16 w-full border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="md:hidden h-9 w-9 rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search feedback, themes, customers..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted/60 text-sm text-foreground placeholder:text-muted-foreground border border-transparent focus:border-brand-500/50 focus:bg-background focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="h-9 w-9 rounded-lg relative"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-600 animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-600" />
            )}
          </Button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-card border border-border shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-foreground">Notifications</h4>
                  {unreadCount > 0 && (
                    <Badge variant="brand" className="text-[10px] py-0 px-1.5">{unreadCount} new</Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg text-xs space-y-1 transition-colors ${
                      item.unread ? "bg-brand-500/10 border border-brand-500/20" : "bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <span className="text-[10px] text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-muted transition-colors focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {initials}
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl bg-card border border-border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 text-xs font-medium">
              <div className="p-3 border-b border-border space-y-1">
                <p className="font-bold text-foreground text-sm">{userName}</p>
                <p className="text-muted-foreground text-[11px] truncate">{userEmail}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <Badge variant="brand" className="text-[10px] uppercase font-bold">{userRole}</Badge>
                  <span className="text-[10px] text-muted-foreground truncate">{orgName}</span>
                </div>
              </div>

              <a href="/dashboard/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-foreground">
                <User className="h-3.5 w-3.5" /> Workspace Profile
              </a>
              <a href="/dashboard/integrations" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-foreground">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Workspace Config
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-destructive/10 text-destructive font-semibold"
              >
                <LogOut className="h-3.5 w-3.5" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
