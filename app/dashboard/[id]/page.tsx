import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FullDashboard from "@/components/full-dashboard";

export default async function DashboardPage({ params }: { params: { id: string } }) {
  // Await the params object
  let resolvedParams;
  try {
    resolvedParams = await params;
  } catch (err) {
    resolvedParams = params; // Fallback
  }

  const { id } = resolvedParams;

  const workflow = await prisma.workflow.findUnique({
    where: { id },
  });

  if (!workflow) {
    return notFound();
  }

  let nodes = [];
  try {
    nodes = JSON.parse(workflow.nodes);
  } catch (e) {
    return <div>Error parsing workflow data.</div>;
  }

  // Look for the KPI Dashboard node's output first
  let targetNode = nodes.find((n: any) => n.data?.type === "kpiDashboard");

  // If KPI doesn't have output yet, fallback to Research Agent 
  if (!targetNode || !targetNode.data?.output) {
    targetNode = nodes.find((n: any) => n.data?.type === "researchAgent");
  }

  const outputData = targetNode?.data?.output;

  if (!outputData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
        <h1 className="text-2xl font-bold text-red-400 mb-4">No Data Found</h1>
        <p className="text-[#888]">
          This workflow hasn't been executed yet, or the KPI Dashboard node has no output. 
          Please submit the test form to generate real data.
        </p>
      </div>
    );
  }

  // Extract research data whether it's nested (kpi node) or flat (research node)
  let dashboardProps = outputData;
  
  if (targetNode.data.type === "researchAgent") {
    // Manually map to KPI shape so the dashboard works
    dashboardProps = {
      score: "TBD",
      tier: "PENDING",
      companyName: outputData.companyName,
      domain: outputData.domain,
      industry: outputData.industry,
      totalFunding: outputData.financialSignals?.[0] || "Unknown",
      research: outputData
    };
  } else {
    // For KPI node, we injected previous nodes into richContext during webhook.
    // However, research outputs were passed sequentially.
    // Let's ensure 'research' is present in the props by finding the research node directly.
    const researchNode = nodes.find((n: any) => n.data?.type === "researchAgent");
    if (researchNode?.data?.output) {
       dashboardProps = {
         ...dashboardProps,
         research: researchNode.data.output
       };
    }
  }

  return <FullDashboard data={dashboardProps} />;
}
