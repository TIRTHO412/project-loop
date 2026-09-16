import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { analyzeFeedbackWithAI } from "@/lib/ai";
import { mockFeedbackList } from "@/lib/db/seed-data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // RBAC: ADMIN, MANAGER, and ANALYST can trigger AI analysis
    const session = await requireRole([Role.ADMIN, Role.MANAGER, Role.ANALYST]);
    const { id: feedbackId } = await params;

    let contentToAnalyze = "";
    let titleToAnalyze = "";

    try {
      const feedback = await db.feedback.findUnique({
        where: { id: feedbackId },
      });

      if (!feedback || feedback.organizationId !== session.organizationId) {
        return NextResponse.json({ error: "Forbidden or Feedback not found." }, { status: 403 });
      }

      contentToAnalyze = feedback.content;
      titleToAnalyze = feedback.title;

      // Execute AI Service
      const aiResult = await analyzeFeedbackWithAI(contentToAnalyze, titleToAnalyze);

      // Upsert analysis record
      const updatedFeedback = await db.feedback.update({
        where: { id: feedbackId },
        data: {
          sentiment: aiResult.sentiment,
          sentimentScore: aiResult.sentimentScore,
          category: aiResult.category,
          theme: aiResult.themes[0] || "General",
          analysis: {
            upsert: {
              create: {
                sentiment: aiResult.sentiment,
                sentimentScore: aiResult.sentimentScore,
                confidence: aiResult.confidence,
                summary: aiResult.summary,
                category: aiResult.category,
                keyIssues: aiResult.themes,
                recommendations: aiResult.recommendations,
                model: aiResult.model,
              },
              update: {
                sentiment: aiResult.sentiment,
                sentimentScore: aiResult.sentimentScore,
                confidence: aiResult.confidence,
                summary: aiResult.summary,
                category: aiResult.category,
                keyIssues: aiResult.themes,
                recommendations: aiResult.recommendations,
                model: aiResult.model,
                analyzedAt: new Date(),
              },
            },
          },
        },
        include: { analysis: true },
      });

      return NextResponse.json({ success: true, data: updatedFeedback });
    } catch (e) {
      // Memory Store fallback
      const found = mockFeedbackList.find((f) => f.id === feedbackId);
      if (!found) {
        return NextResponse.json({ error: "Feedback item not found." }, { status: 404 });
      }

      const aiResult = await analyzeFeedbackWithAI(found.content, found.title);
      (found as any).analysis = aiResult;
      found.sentiment = aiResult.sentiment.toLowerCase() as any;
      found.sentimentScore = aiResult.sentimentScore / 100;

      return NextResponse.json({ success: true, data: found, analysis: aiResult });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to analyze feedback" }, { status: 500 });
  }
}
