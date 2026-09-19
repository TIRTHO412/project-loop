import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth/session";
import { memoryReportsStore } from "@/lib/reports";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id: reportId } = await params;

    let reportPayload: any = null;

    try {
      const report = await db.report.findUnique({
        where: { id: reportId },
      });

      if (!report) {
        return NextResponse.json({ error: "Report not found." }, { status: 404 });
      }

      // Step 14: Multi-tenant security check
      if (report.organizationId !== session.organizationId) {
        return NextResponse.json({ error: "Forbidden. Access denied to this organization report." }, { status: 403 });
      }

      reportPayload = report.content ? JSON.parse(report.content) : report;
    } catch (e) {
      const found = memoryReportsStore.find((r) => r.id === reportId);
      if (!found) {
        return NextResponse.json({ error: "Report not found." }, { status: 404 });
      }
      if (found.organizationId !== session.organizationId) {
        return NextResponse.json({ error: "Forbidden. Access denied to this report." }, { status: 403 });
      }
      reportPayload = found;
    }

    return NextResponse.json({
      success: true,
      data: reportPayload,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to prepare PDF data" }, { status: 500 });
  }
}
