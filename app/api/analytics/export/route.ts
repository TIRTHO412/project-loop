import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getOrganizationAnalytics } from "@/lib/analytics";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get("timeframe") || "30d") as "7d" | "30d" | "90d" | "year" | "all";

    const analytics = await getOrganizationAnalytics(session.organizationId, timeframe);

    let csvContent = `Project LOOP - Executive Analytics Export\n`;
    csvContent += `Organization,${session.organizationName}\n`;
    csvContent += `Timeframe,${timeframe}\n`;
    csvContent += `Export Date,${new Date().toISOString()}\n\n`;

    csvContent += `KPI Summary\n`;
    csvContent += `Metric,Value\n`;
    csvContent += `Total Feedback,${analytics.kpis.totalFeedback}\n`;
    csvContent += `Positive Sentiment,${analytics.kpis.positiveCount} (${analytics.kpis.positivePercent}%)\n`;
    csvContent += `Neutral Sentiment,${analytics.kpis.neutralCount} (${analytics.kpis.neutralPercent}%)\n`;
    csvContent += `Negative Sentiment,${analytics.kpis.negativeCount} (${analytics.kpis.negativePercent}%)\n`;
    csvContent += `CSAT Score,${analytics.kpis.csatScore}\n`;
    csvContent += `Open Action Items,${analytics.kpis.openIssues}\n\n`;

    csvContent += `Top Themes Breakdown\n`;
    csvContent += `Theme,Feedback Count,Positive,Neutral,Negative,Avg Sentiment Score\n`;
    analytics.topThemes.forEach((t) => {
      csvContent += `"${t.theme}",${t.count},${t.positiveCount},${t.neutralCount},${t.negativeCount},${t.sentimentScore}/100\n`;
    });

    csvContent += `\nFeedback Sources Breakdown\n`;
    csvContent += `Source,Count,Percentage\n`;
    analytics.sourcesBreakdown.forEach((s) => {
      csvContent += `"${s.source}",${s.count},${s.percentage}%\n`;
    });

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="loop_analytics_${session.organizationSlug}_${timeframe}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to export analytics CSV" }, { status: 500 });
  }
}
