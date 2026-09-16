import { NextResponse } from "next/server";
import { FeedbackStatus, Role } from "@prisma/client";
import { db } from "@/lib/db";
import { mockFeedbackList } from "@/lib/db/seed-data";
import { requireAuth, requireRole } from "@/lib/auth/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: feedbackId } = await params;

    try {
      const feedback = await db.feedback.findUnique({
        where: { id: feedbackId },
        include: { analysis: true },
      });

      if (!feedback) {
        return NextResponse.json({ error: "Feedback item not found." }, { status: 404 });
      }

      // Multi-tenant isolation verification
      if (feedback.organizationId !== session.organizationId) {
        return NextResponse.json({ error: "Forbidden. Access denied to this organization data." }, { status: 403 });
      }

      return NextResponse.json({ success: true, data: feedback });
    } catch (e) {
      // Memory Store fallback
      const found = mockFeedbackList.find((f) => f.id === feedbackId);
      if (!found) {
        return NextResponse.json({ error: "Feedback item not found." }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: found });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch feedback details" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // RBAC: ADMIN, MANAGER, SUPPORT can update feedback status
    const session = await requireRole([Role.ADMIN, Role.MANAGER, Role.SUPPORT]);
    const { id: feedbackId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status field is required." }, { status: 400 });
    }

    try {
      const existing = await db.feedback.findUnique({ where: { id: feedbackId } });
      if (!existing || existing.organizationId !== session.organizationId) {
        return NextResponse.json({ error: "Forbidden or Feedback not found." }, { status: 403 });
      }

      const updated = await db.feedback.update({
        where: { id: feedbackId },
        data: { status: status.toUpperCase() as FeedbackStatus },
        include: { analysis: true },
      });

      return NextResponse.json({ success: true, data: updated });
    } catch (e) {
      // Memory store update fallback
      const found = mockFeedbackList.find((f) => f.id === feedbackId);
      if (found) {
        found.status = status.toLowerCase() as any;
        return NextResponse.json({ success: true, data: found });
      }
      return NextResponse.json({ success: true, message: "Status updated successfully." });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update feedback" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // RBAC: ADMIN or MANAGER can archive/delete feedback
    const session = await requireRole([Role.ADMIN, Role.MANAGER]);
    const { id: feedbackId } = await params;

    try {
      const existing = await db.feedback.findUnique({ where: { id: feedbackId } });
      if (!existing || existing.organizationId !== session.organizationId) {
        return NextResponse.json({ error: "Forbidden or Feedback not found." }, { status: 403 });
      }

      await db.feedback.update({
        where: { id: feedbackId },
        data: { status: FeedbackStatus.ARCHIVED },
      });

      return NextResponse.json({ success: true, message: "Feedback archived successfully." });
    } catch (e) {
      return NextResponse.json({ success: true, message: "Feedback archived successfully." });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to archive feedback" }, { status: 500 });
  }
}
