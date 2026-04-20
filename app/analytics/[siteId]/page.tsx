"use client";

import { useParams } from "next/navigation";
import VisitorAnalyticsDashboard from "@/components/visitor-analytics";

export default function AnalyticsPage() {
  const params = useParams();
  const siteId = params.siteId as string;

  if (!siteId) {
    return (
      <div className="min-h-screen bg-[#060612] flex items-center justify-center text-white">
        <p>No site ID provided</p>
      </div>
    );
  }

  return <VisitorAnalyticsDashboard siteId={siteId} />;
}
