import { NextRequest, NextResponse } from "next/server";
import { getSiteAnalytics, getVisitor, getAllSites } from "@/lib/tracking-store";

// GET /api/tracking/analytics?siteId=xxx
// Optional: ?visitorId=xxx for single visitor detail
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const visitorId = searchParams.get("visitorId");

    // If no siteId, return list of all tracked sites
    if (!siteId) {
      const sites = getAllSites();
      return NextResponse.json({
        sites,
        total: sites.length,
      });
    }

    // Single visitor detail
    if (visitorId) {
      const visitor = getVisitor(siteId, visitorId);
      if (!visitor) {
        return NextResponse.json(
          { error: "Visitor not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(visitor);
    }

    // Full site analytics
    const analytics = getSiteAnalytics(siteId);

    // Build engagement timeline (events per minute over last hour)
    const now = Date.now();
    const timeline: { time: string; events: number; visitors: number }[] = [];
    for (let i = 59; i >= 0; i--) {
      const minuteStart = now - (i + 1) * 60000;
      const minuteEnd = now - i * 60000;
      const timeLabel = new Date(minuteEnd).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      let eventCount = 0;
      const activeVisitorSet = new Set<string>();
      analytics.visitors.forEach((v) => {
        v.events.forEach((e) => {
          const ts = new Date(e.timestamp).getTime();
          if (ts >= minuteStart && ts < minuteEnd) {
            eventCount++;
            activeVisitorSet.add(v.visitorId);
          }
        });
      });

      timeline.push({
        time: timeLabel,
        events: eventCount,
        visitors: activeVisitorSet.size,
      });
    }

    // Scroll depth distribution
    const scrollBuckets = [
      { range: "0-20%", count: 0 },
      { range: "20-40%", count: 0 },
      { range: "40-60%", count: 0 },
      { range: "60-80%", count: 0 },
      { range: "80-100%", count: 0 },
    ];
    analytics.visitors.forEach((v) => {
      const d = v.maxScrollDepth;
      if (d < 20) scrollBuckets[0].count++;
      else if (d < 40) scrollBuckets[1].count++;
      else if (d < 60) scrollBuckets[2].count++;
      else if (d < 80) scrollBuckets[3].count++;
      else scrollBuckets[4].count++;
    });

    return NextResponse.json({
      ...analytics,
      timeline,
      scrollDistribution: scrollBuckets,
      // Strip heavy event arrays from visitors list for the overview
      visitors: analytics.visitors.map((v) => ({
        visitorId: v.visitorId,
        name: v.name || null,
        email: v.email || null,
        score: v.score,
        scoreBreakdown: v.scoreBreakdown || null,
        totalTimeSeconds: v.totalTimeSeconds,
        maxScrollDepth: v.maxScrollDepth,
        clickCount: v.clickCount,
        pages: v.pages,
        pagesVisited: v.pages.length,
        startedAt: v.startedAt,
        lastActiveAt: v.lastActiveAt,
        userAgent: v.userAgent,
        referrer: v.referrer,
        isActive: now - new Date(v.lastActiveAt).getTime() < 5 * 60 * 1000,
      })),
    });
  } catch (error: any) {
    console.error("[tracking/analytics] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
