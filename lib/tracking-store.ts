import fs from "fs";
import path from "path";

// ─── TYPES ───────────────────────────────────────────────────────────

export interface TrackingEvent {
  type:
    | "pageview"
    | "click"
    | "scroll"
    | "heartbeat"
    | "idle"
    | "leave"
    | "mousemove"
    | "focus"
    | "blur";
  timestamp: string;
  data: Record<string, any>;
}

export interface VisitorSession {
  visitorId: string;
  siteId: string;
  name?: string;
  email?: string;
  userAgent: string;
  referrer: string;
  startedAt: string;
  lastActiveAt: string;
  pages: string[];
  totalTimeSeconds: number;
  maxScrollDepth: number;
  clickCount: number;
  events: TrackingEvent[];
  score: number;
  scoreBreakdown?: {
    time: number;
    clicks: number;
    scroll: number;
    pages: number;
    loyalty: number;
  };
}

export interface SiteAnalytics {
  siteId: string;
  totalVisitors: number;
  activeVisitors: number;
  avgTimeSeconds: number;
  avgScrollDepth: number;
  avgClicks: number;
  topPages: { page: string; views: number }[];
  topClickedElements: { element: string; clicks: number }[];
  visitors: VisitorSession[];
  scoreDistribution: { hot: number; warm: number; cold: number };
}

// ─── SCORING ENGINE ──────────────────────────────────────────────────

function computeBehavioralScore(session: VisitorSession): { total: number; breakdown: any } {
  let timeScore = 0;
  let clickScore = 0;
  let scrollScore = 0;
  let pagesScore = 0;
  let loyaltyScore = 0;

  // Time spent (max 30 pts)
  const seconds = session.totalTimeSeconds;
  if (seconds >= 300) timeScore = 30;
  else if (seconds >= 180) timeScore = 22;
  else if (seconds >= 60) timeScore = 15;
  else if (seconds >= 30) timeScore = 10;
  else if (seconds >= 10) timeScore = 5;

  // Click engagement (max 25 pts)
  const clicks = session.clickCount;
  if (clicks >= 11) clickScore = 25;
  else if (clicks >= 6) clickScore = 17;
  else if (clicks >= 3) clickScore = 10;
  else if (clicks >= 1) clickScore = 5;

  // Scroll depth (max 20 pts)
  const scroll = session.maxScrollDepth;
  if (scroll >= 80) scrollScore = 20;
  else if (scroll >= 60) scrollScore = 15;
  else if (scroll >= 30) scrollScore = 10;
  else if (scroll >= 10) scrollScore = 5;

  // Pages visited (max 15 pts)
  const pages = session.pages.length;
  if (pages >= 4) pagesScore = 15;
  else if (pages >= 3) pagesScore = 8;
  else if (pages >= 2) pagesScore = 5;

  // Return visits (max 10 pts)
  const events = session.events;
  if (events.length > 0) {
    const firstEvent = new Date(events[0].timestamp).getTime();
    const lastEvent = new Date(events[events.length - 1].timestamp).getTime();
    const sessionSpanHours = (lastEvent - firstEvent) / (1000 * 60 * 60);
    if (sessionSpanHours > 24) loyaltyScore = 10;
    else if (sessionSpanHours > 1) loyaltyScore = 5;
  }

  const total = Math.min(timeScore + clickScore + scrollScore + pagesScore + loyaltyScore, 100);
  
  return {
    total,
    breakdown: {
      time: timeScore,
      clicks: clickScore,
      scroll: scrollScore,
      pages: pagesScore,
      loyalty: loyaltyScore
    }
  };
}

// ─── FILE-BACKED STORE ─────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tracking-events.json");

interface StoreData {
  visitors: Record<string, VisitorSession>; // keyed by `${siteId}:${visitorId}`
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): StoreData {
  ensureDataDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("[tracking-store] Failed to read store, resetting:", e);
  }
  return { visitors: {} };
}

function writeStore(data: StoreData) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// ─── PUBLIC API ──────────────────────────────────────────────────────

export function addTrackingEvent(
  siteId: string,
  visitorId: string,
  event: TrackingEvent,
  meta: { userAgent?: string; referrer?: string; page?: string } = {}
) {
  const store = readStore();
  const key = `${siteId}:${visitorId}`;

  if (!store.visitors[key]) {
    store.visitors[key] = {
      visitorId,
      siteId,
      userAgent: meta.userAgent || "unknown",
      referrer: meta.referrer || "",
      startedAt: event.timestamp,
      lastActiveAt: event.timestamp,
      pages: [],
      totalTimeSeconds: 0,
      maxScrollDepth: 0,
      clickCount: 0,
      events: [],
      score: 0,
    };
  }

  const session = store.visitors[key];

  // Update metadata
  session.lastActiveAt = event.timestamp;
  if (meta.userAgent) session.userAgent = meta.userAgent;
  if (meta.referrer) session.referrer = meta.referrer;

  // Process event
  switch (event.type) {
    case "pageview":
      if (event.data.page && !session.pages.includes(event.data.page)) {
        session.pages.push(event.data.page);
      }
      break;

    case "click":
      session.clickCount++;
      break;

    case "scroll":
      if (
        typeof event.data.depth === "number" &&
        event.data.depth > session.maxScrollDepth
      ) {
        session.maxScrollDepth = event.data.depth;
      }
      break;

    case "heartbeat":
      if (typeof event.data.timeOnPage === "number") {
        session.totalTimeSeconds = Math.max(
          session.totalTimeSeconds,
          event.data.timeOnPage
        );
      }
      break;

    case "leave":
      if (typeof event.data.totalTime === "number") {
        session.totalTimeSeconds = Math.max(
          session.totalTimeSeconds,
          event.data.totalTime
        );
      }
      break;

    case "identify":
      if (event.data.name) session.name = event.data.name;
      if (event.data.email) session.email = event.data.email;
      break;
  }

  // Add event (cap at 500 per visitor to avoid bloat)
  if (session.events.length < 500) {
    session.events.push(event);
  }

  // Recompute score
  const scoreResult = computeBehavioralScore(session);
  session.score = scoreResult.total;
  session.scoreBreakdown = scoreResult.breakdown;

  writeStore(store);
  return session;
}

export function addBatchEvents(
  siteId: string,
  visitorId: string,
  events: TrackingEvent[],
  meta: { userAgent?: string; referrer?: string; page?: string } = {}
): VisitorSession | null {
  let session: VisitorSession | null = null;
  for (const event of events) {
    session = addTrackingEvent(siteId, visitorId, event, meta);
  }
  return session;
}

export function getVisitor(
  siteId: string,
  visitorId: string
): VisitorSession | null {
  const store = readStore();
  return store.visitors[`${siteId}:${visitorId}`] || null;
}

export function getSiteVisitors(siteId: string): VisitorSession[] {
  const store = readStore();
  return Object.values(store.visitors).filter((v) => v.siteId === siteId);
}

export function getSiteAnalytics(siteId: string): SiteAnalytics {
  const visitors = getSiteVisitors(siteId);

  const now = Date.now();
  const activeThreshold = 5 * 60 * 1000; // 5 minutes
  const activeVisitors = visitors.filter(
    (v) => now - new Date(v.lastActiveAt).getTime() < activeThreshold
  ).length;

  const avgTimeSeconds =
    visitors.length > 0
      ? visitors.reduce((sum, v) => sum + v.totalTimeSeconds, 0) /
        visitors.length
      : 0;

  const avgScrollDepth =
    visitors.length > 0
      ? visitors.reduce((sum, v) => sum + v.maxScrollDepth, 0) /
        visitors.length
      : 0;

  const avgClicks =
    visitors.length > 0
      ? visitors.reduce((sum, v) => sum + v.clickCount, 0) / visitors.length
      : 0;

  // Top pages
  const pageCounts: Record<string, number> = {};
  visitors.forEach((v) => {
    v.pages.forEach((p) => {
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });
  });
  const topPages = Object.entries(pageCounts)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Top clicked elements
  const clickCounts: Record<string, number> = {};
  visitors.forEach((v) => {
    v.events
      .filter((e) => e.type === "click")
      .forEach((e) => {
        const label = e.data.text || e.data.tag || "unknown";
        clickCounts[label] = (clickCounts[label] || 0) + 1;
      });
  });
  const topClickedElements = Object.entries(clickCounts)
    .map(([element, clicks]) => ({ element, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // Score distribution
  const scoreDistribution = { hot: 0, warm: 0, cold: 0 };
  visitors.forEach((v) => {
    if (v.score >= 70) scoreDistribution.hot++;
    else if (v.score >= 40) scoreDistribution.warm++;
    else scoreDistribution.cold++;
  });

  return {
    siteId,
    totalVisitors: visitors.length,
    activeVisitors,
    avgTimeSeconds: Math.round(avgTimeSeconds),
    avgScrollDepth: Math.round(avgScrollDepth),
    avgClicks: Math.round(avgClicks * 10) / 10,
    topPages,
    topClickedElements,
    visitors: visitors.sort((a, b) => b.score - a.score), // highest score first
    scoreDistribution,
  };
}

export function getAllSites(): string[] {
  const store = readStore();
  const sites = new Set<string>();
  Object.values(store.visitors).forEach((v) => sites.add(v.siteId));
  return Array.from(sites);
}
