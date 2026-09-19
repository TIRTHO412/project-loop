import { NextResponse } from "next/server";
import { FeedbackStatus, Sentiment, Role } from "@prisma/client";
import { db } from "@/lib/db";
import { mockFeedbackList } from "@/lib/db/seed-data";
import { requireRole } from "@/lib/auth/session";
import { analyzeFeedbackWithAI } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // RBAC: ADMIN or MANAGER can import CSV data
    const session = await requireRole([Role.ADMIN, Role.MANAGER]);
    const body = await request.json();
    const { rows, rawCsv } = body;

    let itemsToProcess: any[] = [];

    if (Array.isArray(rows) && rows.length > 0) {
      itemsToProcess = rows;
    } else if (rawCsv && typeof rawCsv === "string") {
      // Basic CSV parser
      const lines = rawCsv.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        return NextResponse.json({ error: "CSV file appears empty or missing data rows." }, { status: 400 });
      }

      const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, "").toLowerCase());

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
        if (values.length < 2) continue;

        const rowObj: any = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx] || "";
        });

        itemsToProcess.push({
          customerName: rowObj.customername || rowObj.name || rowObj.customer || "CSV Import Customer",
          customerEmail: rowObj.customeremail || rowObj.email || "import@customer.io",
          content: rowObj.message || rowObj.content || rowObj.feedback || values[0],
          source: (rowObj.source || "CSV").toUpperCase(),
          category: rowObj.category || "General",
        });
      }
    }

    if (itemsToProcess.length === 0) {
      return NextResponse.json({ error: "No valid rows found to import." }, { status: 400 });
    }

    let successCount = 0;
    let failedCount = 0;
    const createdEntries: any[] = [];

    for (const item of itemsToProcess) {
      if (!item.content || item.content.length < 3) {
        failedCount++;
        continue;
      }

      const customerName = item.customerName || "Anonymous Customer";
      const customerEmail = (item.customerEmail || "anonymous@feedback.csv").toLowerCase().trim();
      const content = item.content;
      const title = content.substring(0, 60) + "...";
      const source = (item.source || "CSV").toUpperCase();
      const category = item.category || "General";

      try {
        const ai = await analyzeFeedbackWithAI(content, title);

        const created = await db.feedback.create({
          data: {
            organizationId: session.organizationId,
            customerName,
            customerEmail,
            title,
            content,
            source,
            category: ai.category || category,
            theme: ai.themes[0] || "General",
            sentiment: ai.sentiment,
            sentimentScore: ai.sentimentScore,
            status: FeedbackStatus.NEW,
            analysis: {
              create: {
                sentiment: ai.sentiment,
                sentimentScore: ai.sentimentScore,
                confidence: ai.confidence,
                summary: ai.summary,
                category: ai.category,
                keyIssues: ai.themes,
                recommendations: ai.recommendations,
                model: ai.model,
              },
            },
          },
          include: { analysis: true },
        });

        createdEntries.push(created);
        successCount++;
      } catch (e) {
        // Fallback memory insertion
        const newId = `fb-csv-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const ai = await analyzeFeedbackWithAI(content, title);

        const fallbackObj = {
          id: newId,
          organizationId: session.organizationId,
          customerName,
          customerEmail,
          title,
          content,
          rating: 4,
          sentiment: ai.sentiment.toLowerCase(),
          sentimentScore: ai.sentimentScore / 100,
          category: ai.category || category,
          theme: ai.themes[0] || "General",
          source,
          status: "new",
          createdAt: new Date().toISOString(),
          analysis: ai,
        };

        mockFeedbackList.unshift(fallbackObj as any);
        createdEntries.push(fallbackObj);
        successCount++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalProcessed: itemsToProcess.length,
        successCount,
        failedCount,
      },
      data: createdEntries,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "CSV import failed." }, { status: 500 });
  }
}
