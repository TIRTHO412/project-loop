import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getOrganizationAnalytics } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") || "30d") as "7d" | "30d" | "90d" | "year" | "all";

    const data = await getOrganizationAnalytics(session.organizationId, timeframe);

    return NextResponse.json({
      success: true,
      organizationName: session.organizationName,
      data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 });
  }
}
