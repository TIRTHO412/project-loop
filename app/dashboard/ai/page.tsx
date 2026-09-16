"use client";

import * as React from "react";
import { Bot, Send, Sparkles, Trash2, HelpCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const suggestedQuestions = [
  "What are customers complaining about most?",
  "How is overall sentiment this month?",
  "What are the most common positive themes?",
  "Which feedback themes are growing recently?",
  "Show me negative feedback related to pricing.",
];

export default function LoopAIPage() {
  const [session, setSession] = React.useState<any>(null);
  const [conversationId, setConversationId] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content:
        "### Summary\nWelcome to **LOOP AI**! I am your organization's AI Customer Feedback Assistant.\n\n### Capabilities\n- Query customer complaints & positive praise\n- Analyze sentiment trajectories and theme spikes\n- Summarize customer quotes across all connected channels\n\n*Ask me a question or click a suggested query below to begin.*",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setSession(data.session);
      });
  }, []);

  const handleSendQuestion = async (questionText: string) => {
    if (!questionText.trim() || loading) return;

    const userMsg = questionText.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg, conversationId }),
      });

      const data = await res.json();

      if (res.ok) {
        setConversationId(data.conversationId);
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `### Error\n${data.error || "I was unable to answer that question. Please try again."}`,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "### Error\nNetwork connection error while contacting LOOP AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "### Summary\nConversation reset. Ask a new question about your customer feedback repository.",
      },
    ]);
    setConversationId("");
  };

  const orgName = session?.organizationName || "Acme Cloud Inc.";
  const userName = session?.name || "Alex Dev";
  const userRole = session?.role || "ADMIN";

  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 w-full text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              LOOP AI Assistant
            </h1>
            <Badge variant="brand" className="gap-1 font-bold text-[10px] uppercase">
              <Sparkles className="h-3 w-3" /> GPT-4o Pipeline
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Ask natural language questions about customer feedback for <strong className="text-foreground">{orgName}</strong>.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleClearChat}
          className="gap-2 text-xs font-semibold shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5 text-rose-500" /> Clear Conversation
        </Button>
      </div>

      {/* Main Chat Interface */}
      <Card className="glass-card shadow-2xl flex flex-col h-[650px] border-brand-500/30 w-full text-left">
        {/* Chat Status Header */}
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-foreground">
                  Feedback Intelligence Agent
                </CardTitle>
                <CardDescription className="text-xs">
                  Scoped strictly to Organization Tenant: {orgName} ({userRole} Role)
                </CardDescription>
              </div>
            </div>

            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Active Session
            </span>
          </div>
        </CardHeader>

        {/* Message Stream */}
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-sm ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 font-bold border border-brand-500/20">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-3xl text-sm leading-relaxed text-left ${
                  msg.role === "user"
                    ? "bg-brand-600 text-white font-medium rounded-tr-none shadow-md"
                    : "bg-muted/70 text-foreground border border-border rounded-tl-none whitespace-pre-line font-sans"
                }`}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                  {userInitials}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-muted-foreground animate-pulse text-left">
              <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/60 border border-border flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-brand-500" />
                <span>LOOP AI is querying your organization feedback database...</span>
              </div>
            </div>
          )}
        </CardContent>

        {/* Quick Suggested Questions Bar */}
        <div className="px-4 py-2 bg-muted/30 border-t border-border/60 flex items-center gap-2 overflow-x-auto no-scrollbar text-left">
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-[11px] text-muted-foreground font-semibold shrink-0">Try asking:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuestion(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-card hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 border border-border shrink-0 transition-colors text-foreground font-medium text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-border bg-card text-left">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuestion(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask LOOP AI e.g. 'What are customers complaining about most?'..."
              className="flex-1 h-11 px-4 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            <Button
              type="submit"
              variant="gradient"
              disabled={loading || !input.trim()}
              className="h-11 px-6 gap-2 font-semibold shadow-md"
            >
              Send <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
