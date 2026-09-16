"use client";

import * as React from "react";
import { Layers, CheckCircle2, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const integrationsList = [
  { id: "i-1", name: "Intercom", desc: "Sync customer support chats & in-app feedback automatically.", status: "Connected", icon: "💬" },
  { id: "i-2", name: "Zendesk", desc: "Import support tickets for real-time sentiment analysis.", status: "Connected", icon: "🎧" },
  { id: "i-3", name: "G2 Reviews", desc: "Pull verified buyer reviews & competitive ratings.", status: "Connected", icon: "⭐" },
  { id: "i-4", name: "Slack", desc: "Broadcast emerging sentiment spikes to product channels.", status: "Available", icon: "⚡" },
  { id: "i-5", name: "Trustpilot", desc: "Monitor public review trends & customer satisfaction.", status: "Available", icon: "🛡️" },
  { id: "i-6", name: "Custom Webhook", desc: "POST raw JSON feedback payloads to LOOP API endpoints.", status: "Active", icon: "🔗" },
];

export default function IntegrationsPage() {
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setSession(data.session);
      });
  }, []);

  const orgName = session?.organizationName || "Acme Cloud Inc.";

  return (
    <div className="space-y-6 w-full text-left">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Connected Integrations
          </h1>
          <Badge variant="brand" className="text-[10px] font-bold uppercase">{orgName}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Sync customer feedback channels into your organization's unified intelligence stream.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {integrationsList.map((item) => (
          <Card key={item.id} className="glass-card text-left">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <Badge
                  variant={item.status === "Connected" || item.status === "Active" ? "positive" : "secondary"}
                  className="text-[10px] font-bold"
                >
                  {item.status}
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold text-foreground mt-2">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-left">
              <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                {item.desc}
              </CardDescription>
              <Button
                variant={item.status === "Connected" ? "outline" : "gradient"}
                size="sm"
                className="w-full text-xs font-semibold justify-start pl-4"
              >
                {item.status === "Connected" ? "Configure Integration" : "Connect Channel"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
