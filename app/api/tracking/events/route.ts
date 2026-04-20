import { NextRequest, NextResponse } from "next/server";
import { addBatchEvents } from "@/lib/tracking-store";

// CORS headers for cross-origin tracking
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// OPTIONS — handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// POST /api/tracking/events — receive batched events from tracking script
export async function POST(request: NextRequest) {
  try {
    let body: any;

    // Handle both JSON and sendBeacon (which sends as text/plain)
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const text = await request.text();
      try {
        body = JSON.parse(text);
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON payload" },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    const { siteId, visitorId, events, meta } = body;

    if (!siteId || !visitorId || !Array.isArray(events)) {
      return NextResponse.json(
        { error: "Missing required fields: siteId, visitorId, events" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate events
    const validEvents = events.filter(
      (e: any) =>
        e &&
        typeof e.type === "string" &&
        typeof e.timestamp === "string"
    );

    if (validEvents.length === 0) {
      return NextResponse.json(
        { error: "No valid events in payload" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Store events
    const session = addBatchEvents(siteId, visitorId, validEvents, {
      userAgent: meta?.userAgent || request.headers.get("user-agent") || "",
      referrer: meta?.referrer || "",
      page: meta?.page || "",
    });

    return NextResponse.json(
      {
        ok: true,
        eventsReceived: validEvents.length,
        visitorScore: session?.score || 0,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[tracking/events] Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
