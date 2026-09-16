import { NextResponse } from "next/server";
import { Sentiment, FeedbackStatus } from "@prisma/client";
import { db, demoUsers, demoOrganizations } from "@/lib/db";
import { mockFeedbackList } from "@/lib/db/seed-data";
import { getSession, requireAuth } from "@/lib/auth/session";
import { analyzeFeedbackWithAI } from "@/lib/ai";

// In-memory feedback store fallback when DB is disconnected
let memoryFeedbackStore: any[] = [...mockFeedbackList];

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const sentimentFilter = searchParams.get("sentiment");
    const statusFilter = searchParams.get("status");
    const sourceFilter = searchParams.get("source");

    let results: any[] = [];

    try {
      // Query PostgreSQL via Prisma scoped strictly by organizationId
      const whereClause: any = {
        organizationId: session.organizationId,
      };

      if (sentimentFilter && sentimentFilter !== "all") {
        whereClause.sentiment = sentimentFilter.toUpperCase() as Sentiment;
      }
      if (statusFilter && statusFilter !== "all") {
        whereClause.status = statusFilter.toUpperCase() as FeedbackStatus;
      }
      if (sourceFilter && sourceFilter !== "all") {
        whereClause.source = sourceFilter.toUpperCase();
      }

      if (search) {
        whereClause.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { customerName: { contains: search, mode: "insensitive" } },
          { customerEmail: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ];
      }

      results = await db.feedback.findMany({
        where: whereClause,
        include: { analysis: true },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      // Fallback in-memory query
      results = memoryFeedbackStore.filter((item) => {
        // Multi-tenant check
        if (item.organizationId && item.organizationId !== session.organizationId) {
          return false;
        }

        if (sentimentFilter && sentimentFilter !== "all" && item.sentiment !== sentimentFilter.toLowerCase()) {
          return false;
        }
        if (statusFilter && statusFilter !== "all" && item.status !== statusFilter.toLowerCase()) {
          return false;
        }
        if (sourceFilter && sourceFilter !== "all" && item.source.toLowerCase() !== sourceFilter.toLowerCase()) {
          return false;
        }
        if (search) {
          const text = `${item.title} ${item.content} ${item.customerName} ${item.customerEmail} ${item.category} ${item.theme}`.toLowerCase();
          if (!text.includes(search)) return false;
        }
        return true;
      });
    }

    return NextResponse.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { customerName, customerEmail, customerCompany, title, content, source, category, autoAnalyze } = body;

    if (!customerName || !customerEmail || !content) {
      return NextResponse.json(
        { error: "Customer Name, Customer Email, and Feedback Content are required." },
        { status: 400 }
      );
    }

    const cleanTitle = title || content.substring(0, 60) + "...";
    const cleanSource = (source || "WEBSITE").toUpperCase();
    const cleanCategory = category || "General";

    // Run AI Analysis
    const aiAnalysis = await analyzeFeedbackWithAI(content, cleanTitle);

    let createdFeedback: any = null;

    try {
      createdFeedback = await db.feedback.create({
        data: {
          organizationId: session.organizationId,
          customerName,
          customerEmail: customerEmail.toLowerCase().trim(),
          customerCompany: customerCompany || null,
          title: cleanTitle,
          content,
          source: cleanSource,
          category: aiAnalysis.category || cleanCategory,
          theme: aiAnalysis.themes[0] || "Product Quality",
          sentiment: aiAnalysis.sentiment,
          sentimentScore: aiAnalysis.sentimentScore,
          status: FeedbackStatus.NEW,
          analysis: {
            create: {
              sentiment: aiAnalysis.sentiment,
              sentimentScore: aiAnalysis.sentimentScore,
              confidence: aiAnalysis.confidence,
              summary: aiAnalysis.summary,
              category: aiAnalysis.category,
              keyIssues: aiAnalysis.themes,
              recommendations: aiAnalysis.recommendations,
              model: aiAnalysis.model,
            },
          },
        },
        include: { analysis: true },
      });
    } catch (dbErr) {
      // Memory Store fallback
      const newId = `fb-${Date.now()}`;
      createdFeedback = {
        id: newId,
        organizationId: session.organizationId,
        customerName,
        customerEmail,
        customerCompany,
        title: cleanTitle,
        content,
        rating: aiAnalysis.sentiment === "POSITIVE" ? 5 : aiAnalysis.sentiment === "NEGATIVE" ? 2 : 3,
        sentiment: aiAnalysis.sentiment.toLowerCase(),
        sentimentScore: aiAnalysis.sentimentScore / 100,
        category: aiAnalysis.category || cleanCategory,
        theme: aiAnalysis.themes[0] || "Product Quality",
        source: cleanSource,
        status: "new",
        createdAt: new Date().toISOString(),
        analysis: aiAnalysis,
      };

      memoryFeedbackStore.unshift(createdFeedback);
    }

    return NextResponse.json({ success: true, data: createdFeedback }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create feedback" }, { status: 500 });
  }
}
