import { NodeExecutionContext, NodeExecutionResult } from "./types";
import { nodeDefinitions } from "./node-definitions";

// Helper function to replace template variables like {{input}} or {{input.fieldName}}
function replaceTemplateVariables(text: string, input: any): string {
  if (typeof text !== "string") return text;

  // More forgiving regex: matches {{var}}, {{var}, {var}}, or {var}
  return text.replace(/\{{1,2}([^{}]+?)\}{1,2}/g, (match, path) => {
    const trimmedPath = path.trim();
    if (!input || typeof input !== "object") return match;

    // Remove "input." prefix if it exists
    const cleanPath = trimmedPath.startsWith("input.")
      ? trimmedPath.substring(6)
      : trimmedPath;

    if (!cleanPath || cleanPath === "input") {
      return typeof input === "object" ? JSON.stringify(input) : String(input);
    }

    const fields = cleanPath.split(".");
    let result = input;

    for (const field of fields) {
      if (result && typeof result === "object" && field in result) {
        result = result[field];
      } else {
        return match; // Return original if path is invalid
      }
    }

    return result !== undefined && result !== null ? String(result) : match;
  });
}

export class WorkflowExecutor {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  private async executeAINode(
    type: string,
    config: Record<string, any>,
    input: any
  ): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ai/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, config, input }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "AI execution failed");
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || "Failed to execute AI node");
    }
  }

  async executeNode(
    context: NodeExecutionContext
  ): Promise<NodeExecutionResult> {
    const { nodeId, input, config } = context;
    const definition = nodeDefinitions[config.type];

    if (!definition) {
      return {
        success: false,
        error: `Unknown node type: ${config.type}`,
      };
    }

    try {
      switch (definition.category) {
        case "trigger":
          return await this.executeTriggerNode(config, input);

        case "ai":
          return await this.executeAINodeType(config, input);

        case "action":
          return await this.executeActionNode(config, input);

        case "logic":
          return await this.executeLogicNode(config, input);

        default:
          return {
            success: false,
            error: `Unsupported node category: ${definition.category}`,
          };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Execution failed",
      };
    }
  }

  private async executeTriggerNode(
    config: Record<string, any>,
    input: any
  ): Promise<NodeExecutionResult> {
    // Website Tracker node
    if (config.type === "websiteTracker") {
      return this.executeWebsiteTracker(config, input);
    }

    // Trigger nodes pass through their input or generate initial data
    return {
      success: true,
      output: input || {
        triggeredAt: new Date().toISOString(),
        config: config,
      },
    };
  }

  private async executeWebsiteTracker(
    config: Record<string, any>,
    input: any
  ): Promise<NodeExecutionResult> {
    try {
      const { websiteUrl, siteName, trackClicks, trackScroll, trackTime } = config;

      if (!websiteUrl) {
        return {
          success: false,
          error: "Website URL is required",
        };
      }

      // Generate a siteId from the URL
      const siteId = websiteUrl
        .replace(/https?:\/\//, "")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 40);

      const scriptUrl = `${this.baseUrl}/api/tracking/script?siteId=${encodeURIComponent(siteId)}`;
      const embedCode = `<script src="${scriptUrl}" defer></script>`;

      // Try to fetch current analytics
      let analytics = null;
      try {
        const response = await fetch(`${this.baseUrl}/api/tracking/analytics?siteId=${encodeURIComponent(siteId)}`);
        if (response.ok) {
          analytics = await response.json();
        }
      } catch (e) {
        // Analytics fetch is optional
      }

      return {
        success: true,
        output: {
          siteId,
          websiteUrl,
          siteName: siteName || websiteUrl,
          scriptUrl,
          embedCode,
          trackingEnabled: {
            clicks: trackClicks !== "false",
            scroll: trackScroll !== "false",
            time: trackTime !== "false",
          },
          analytics: analytics || {
            totalVisitors: 0,
            activeVisitors: 0,
            avgTimeSeconds: 0,
          },
          dashboardUrl: `/analytics/${siteId}`,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Website tracker setup failed",
      };
    }
  }

  private async executeAINodeType(
    config: Record<string, any>,
    input: any
  ): Promise<NodeExecutionResult> {
    const result = await this.executeAINode(config.type, config, input);
    return {
      success: true,
      output: result,
    };
  }

  private async executeActionNode(
    config: Record<string, any>,
    input: any
  ): Promise<NodeExecutionResult> {
    switch (config.type) {
      case "httpRequest":
        return await this.executeHttpRequest(config, input);

      case "dataTransform":
        return this.executeDataTransform(config, input);

      case "sendEmail":
        return await this.executeSendEmail(config, input);

      case "kpiDashboard":
        return this.executeKpiDashboard(config, input);

      default:
        return {
          success: false,
          error: `Unknown action node type: ${config.type}`,
        };
    }
  }

  private async executeHttpRequest(
    config: Record<string, any>,
    input: any
  ): Promise<NodeExecutionResult> {
    try {
      let { method = "GET", url, headers = "{}", body = "{}" } = config;

      // Process template variables
      url = replaceTemplateVariables(url, input);
      headers = replaceTemplateVariables(headers, input);
      body = replaceTemplateVariables(body, input);

      // Validate URL
      if (!url || typeof url !== "string") {
        return {
          success: false,
          error: "URL is required",
        };
      }

      // Make request through our API to avoid CORS issues
      const response = await fetch(`${this.baseUrl}/api/http-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          method,
          headers,
          body: method !== "GET" ? body : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || "HTTP request failed",
        };
      }

      return {
        success: true,
        output: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "HTTP request failed",
      };
    }
  }

  private executeDataTransform(
    config: Record<string, any>,
    input: any
  ): NodeExecutionResult {
    try {
      const { code } = config;

      // Create a safe function from the code
      const transformFunction = new Function("input", code);
      const output = transformFunction(input);

      return {
        success: true,
        output,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Data transformation failed",
      };
    }
  }

  private async executeSendEmail(
    config: Record<string, any>,
    input: any
  ): Promise<NodeExecutionResult> {
    try {
      let { to, subject, body, from } = config;

      // Debug: Log input to help troubleshoot
      console.log("Email node input:", input);
      console.log("Email config before replacement:", { to, subject, body });

      // Process template variables
      to = replaceTemplateVariables(to, input);
      subject = replaceTemplateVariables(subject, input);
      body = replaceTemplateVariables(body, input);
      from = from ? replaceTemplateVariables(from, input) : undefined;

      // Debug: Log after replacement
      console.log("Email config after replacement:", { to, subject, body });

      // Validate required fields
      if (!to || !subject || !body) {
        return {
          success: false,
          error: "Missing required fields: to, subject, and body are required",
        };
      }

      // Send email through API
      const response = await fetch(`${this.baseUrl}/api/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body, from }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send email");
      }

      const result = await response.json();

      return {
        success: true,
        output: {
          sent: true,
          to,
          subject,
          body,
          messageId: result.messageId,
          sentAt: result.sentAt,
          message: "✉️ Email sent successfully",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to send email",
      };
    }
  }

  private async executeLogicNode(
    config: Record<string, any>,
    input: any
  ): Promise<NodeExecutionResult> {
    switch (config.type) {
      case "ifElse":
        return this.executeIfElse(config, input);

      case "delay":
        return await this.executeDelay(config, input);

      case "leadClassifier":
        return this.executeLeadClassifier(config, input);

      default:
        return {
          success: false,
          error: `Unknown logic node type: ${config.type}`,
        };
    }
  }

  private executeIfElse(
    config: Record<string, any>,
    input: any
  ): NodeExecutionResult {
    try {
      const { condition, operator } = config;

      let result = false;

      if (operator === "javascript") {
        const evaluateFunction = new Function("input", `return ${condition}`);
        result = evaluateFunction(input);
      }

      return {
        success: true,
        output: {
          condition: result,
          branch: result ? "true" : "false",
          input,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Condition evaluation failed",
      };
    }
  }

  private async executeDelay(
    config: Record<string, any>,
    input: any
  ): Promise<NodeExecutionResult> {
    const { duration, unit } = config;
    const ms =
      unit === "seconds" ? parseInt(duration) * 1000 : parseInt(duration);

    await new Promise((resolve) => setTimeout(resolve, ms));

    return {
      success: true,
      output: {
        delayed: ms,
        input,
      },
    };
  }

  private executeLeadClassifier(
    config: Record<string, any>,
    input: any
  ): NodeExecutionResult {
    try {
      const hotThreshold = parseInt(config.hotThreshold || "70");
      const warmThreshold = parseInt(config.warmThreshold || "40");
      const score = input?.score ?? input?.numericScore ?? 0;

      let tier: string;
      let label: string;
      let color: string;
      let priority: string;

      if (score >= hotThreshold) {
        tier = "HOT";
        label = "🔥 HOT";
        color = "#ef4444";
        priority = "immediate";
      } else if (score >= warmThreshold) {
        tier = "WARM";
        label = "🟡 WARM";
        color = "#f59e0b";
        priority = "nurture";
      } else {
        tier = "COLD";
        label = "🔵 COLD";
        color = "#3b82f6";
        priority = "monitor";
      }

      return {
        success: true,
        output: {
          ...input,
          tier,
          label,
          tierColor: color,
          priority,
          classifiedAt: new Date().toISOString(),
          thresholds: { hot: hotThreshold, warm: warmThreshold },
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Lead classification failed",
      };
    }
  }

  private executeKpiDashboard(
    config: Record<string, any>,
    input: any
  ): NodeExecutionResult {
    try {
      // KPI Dashboard is a pass-through that formats data for display
      const dashboard = {
        // Score gauge data
        score: input?.score ?? 0,
        tier: input?.tier ?? input?.aiVerdict ?? "UNKNOWN",
        tierColor: input?.tierColor ?? "#999",

        // AI verdict
        aiVerdict: input?.aiVerdict ?? null,
        confidence: input?.confidence ?? null,
        reasoning: input?.reasoning ?? null,

        // KPI grid
        kpis: {
          revenue: input?.revenue ?? input?.enrichment?.revenue ?? input?.financialSignals?.[0] ?? null,
          revenueGrowth: input?.revenueGrowth ?? input?.enrichment?.revenueGrowth ?? null,
          employeeCount: input?.employeeCount ?? input?.employeeEstimate ?? input?.enrichment?.employeeEstimate ?? null,
          totalFunding: input?.totalFunding ?? input?.enrichment?.totalFunding ?? null,
          lastFundingDate: input?.latestFundingDate ?? input?.enrichment?.latestFundingDate ?? null,
          lastFundingStage: input?.latestFundingStage ?? input?.enrichment?.latestFundingStage ?? null,
          webTraffic: input?.webTrafficMonthly ?? input?.enrichment?.webTrafficMonthly ?? null,
          trafficGrowth: input?.trafficGrowthMoM ?? input?.enrichment?.trafficGrowthMoM ?? null,
        },

        // Flags
        greenFlags: input?.greenFlags ?? [],
        redFlags: input?.redFlags ?? [],
        signals: input?.signals ?? [],

        // Actions
        recommendedAction: input?.recommendedAction ?? null,
        bestAngle: input?.bestAngle ?? null,
        estimatedDealSize: input?.estimatedDealSize ?? null,

        // Company info
        companyName: input?.companyName ?? null,
        domain: input?.domain ?? null,
        industry: input?.industry ?? null,

        // Meta
        showChatbotLink: config.showChatbotLink === "true",
        generatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        output: dashboard,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "KPI Dashboard rendering failed",
      };
    }
  }
}
