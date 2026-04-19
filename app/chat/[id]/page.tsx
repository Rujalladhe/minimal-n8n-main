import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FullChat from "@/components/full-chat";

export default async function ChatPage({ params }: { params: { id: string } }) {
  let resolvedParams;
  try {
    resolvedParams = await params;
  } catch (err) {
    resolvedParams = params;
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

  const chatbotNode = nodes.find((n: any) => n.data?.type === "aiChatbot");

  if (!chatbotNode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
        <h1 className="text-2xl font-bold text-red-400 mb-4">No Chatbot Node Found</h1>
        <p className="text-[#888]">
          This workflow does not contain an AI Chatbot node.
        </p>
      </div>
    );
  }

  return (
    <FullChat 
      output={chatbotNode.data?.output || {}} 
      config={chatbotNode.data?.config || {}}
      companyName={chatbotNode.data?.output?.companyName || "Unknown"}
    />
  );
}
