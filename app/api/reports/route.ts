import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { getSession, requireRole } from "@/lib/auth/session";
import { generateReportData, memoryReportsStore } from "@/lib/reports";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let reports: any[] = [];
    try {
      reports = await db.report.findMany({
        where: { organizationId: session.organizationId },
        orderBy: { generatedAt: "desc" },
      });
    } catch (e) {
      reports = memoryReportsStore.filter((r) => r.organizationId === session.organizationId);
    }

    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // RBAC: ADMIN, MANAGER, ANALYST can generate reports
    const session = await requireRole([Role.ADMIN, Role.MANAGER, Role.ANALYST]);
    const body = await request.json();
    const { dateFrom, dateTo, title } = body;

    const result = await generateReportData(
      session.organizationId,
      session.organizationName,
      session.name,
      dateFrom,
      dateTo,
      title
    );

    if (result.isEmpty) {
      return NextResponse.json(
        { isEmpty: true, error: result.message || "No customer feedback found for this reporting period." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate report" }, { status: 500 });
  }
}
