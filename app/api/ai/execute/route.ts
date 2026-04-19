import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Helper function to replace template variables
function replaceTemplateVariables(text: string, input: any): string {
  if (!text || typeof text !== "string") return text;

  // More forgiving regex: matches {{var}}, {{var}, {var}}, or {var}
  // But we'll prioritize the standard {{var}}
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
        // If not found in current path, return original match
        return match;
      }
    }

    return result !== undefined && result !== null ? String(result) : match;
  });
}

export async function POST(request: NextRequest) {
  try {
    const { type, config, input } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API key not configured. Add GEMINI_API_KEY to .env. Get your free API key from https://ai.google.dev/",
        },
        { status: 500 }
      );
    }

    // Initialize Gemini client
    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Use gemini-3-flash-preview as default (free tier friendly)
    // Other options: gemini-2.0-flash-lite, gemini-1.5-pro, gemini-1.5-flash
    const modelName = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

    let result;

    switch (type) {
      case "aiTextGenerator":
        result = await executeTextGenerator(
          config,
          input,
          genAI,
          modelName
        );
        break;

      case "aiAnalyzer":
        result = await executeAnalyzer(config, input, genAI, modelName);
        break;

      case "aiChatbot":
        result = await executeChatbot(config, input, genAI, modelName);
        break;

      case "aiDataExtractor":
        result = await executeDataExtractor(
          config,
          input,
          genAI,
          modelName
        );
        break;

      case "researchAgent":
        result = await executeResearchAgent(
          config,
          input,
          genAI,
          modelName
        );
        break;

      case "aiScoreEngine":
        result = await executeScoreEngine(
          config,
          input,
          genAI,
          modelName
        );
        break;

      default:
        return NextResponse.json(
          { error: `Unknown AI node type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI execution error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
      response: error.response,
    });

    // Provide helpful error message for model not found
    let errorMessage = error.message || "AI execution failed";
    if (error.message?.includes("is not found") || error.message?.includes("404")) {
      errorMessage = `Model not found. Please check your GEMINI_MODEL environment variable. 
      Common model names: gemini-pro, gemini-1.5-pro, gemini-1.5-flash, gemini-2.0-flash-exp.
      Original error: ${error.message}`;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error.status ? `Status: ${error.status}` : undefined,
      },
      { status: 500 }
    );
  }
}

async function executeTextGenerator(
  config: any,
  input: any,
  genAI: GoogleGenAI,
  modelName: string
) {
  let { prompt, temperature, maxTokens } = config;

  // Replace template variables in prompt
  prompt = replaceTemplateVariables(prompt, input);

  console.log("Executing text generator with:", {
    modelName,
    prompt: prompt?.substring(0, 50),
  });

  const response = await genAI.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      temperature: parseFloat(temperature || "0.7"),
      maxOutputTokens: parseInt(maxTokens || "500"),
    },
  });

  const generatedText = response.text;

  console.log("Text generator completed:", { model: modelName });

  return {
    generatedText,
    model: modelName,
    usage: {
      promptTokens: (response as any).usageMetadata?.promptTokenCount || 0,
      completionTokens: (response as any).usageMetadata?.candidatesTokenCount || 0,
      totalTokens: (response as any).usageMetadata?.totalTokenCount || 0,
    },
  };
}

async function executeAnalyzer(
  config: any,
  input: any,
  genAI: GoogleGenAI,
  modelName: string
) {
  let { text, analysisType } = config;

  // Process template variables in text
  text = replaceTemplateVariables(text, input);

  let systemPrompt = "";
  switch (analysisType) {
    case "sentiment":
      systemPrompt =
        "Analyze the sentiment of the following text. Respond with: Positive, Negative, or Neutral, followed by a confidence score (0-1) and brief explanation.";
      break;
    case "keywords":
      systemPrompt =
        "Extract the most important keywords and phrases from the following text. Return them as a JSON array.";
      break;
    case "summary":
      systemPrompt =
        "Provide a concise summary of the following text in 2-3 sentences.";
      break;
  }

  // Combine system prompt and user text for Gemini
  const fullPrompt = `${systemPrompt}\n\nText to analyze:\n${text}`;
  const response = await genAI.models.generateContent({
    model: modelName,
    contents: fullPrompt,
    config: {
      temperature: 0.3,
    },
  });

  const analysisResult = response.text;

  return {
    analysisType,
    result: analysisResult,
    usage: {
      promptTokens: (response as any).usageMetadata?.promptTokenCount || 0,
      completionTokens: (response as any).usageMetadata?.candidatesTokenCount || 0,
      totalTokens: (response as any).usageMetadata?.totalTokenCount || 0,
    },
  };
}

async function executeChatbot(
  config: any,
  input: any,
  genAI: GoogleGenAI,
  modelName: string
) {
  let { systemPrompt, userMessage, personality, companyContext } = config;

  // Process template variables
  systemPrompt = replaceTemplateVariables(systemPrompt, input);
  userMessage = replaceTemplateVariables(userMessage, input);

  const personalityPrompts = {
    professional: "Respond in a professional and formal manner.",
    friendly: "Respond in a warm, friendly, and conversational manner.",
    concise: "Respond with brief, to-the-point answers.",
  };

  let fullSystemPrompt = `${systemPrompt}\n\n${personalityPrompts[personality as keyof typeof personalityPrompts] || ""
    }`;

  // Company context mode: inject enrichment + scoring data
  if (companyContext || input?.companyName) {
    const companyData = companyContext ? JSON.parse(companyContext) : input;
    const companyName = companyData.companyName || companyData.domain || "this company";
    fullSystemPrompt = `You are a sales intelligence assistant. You have access to the following company research data for ${companyName}:\n\n${JSON.stringify(companyData, null, 2)}\n\nAnswer questions about this company based on this data. If asked something not in the data, say so clearly. Useful questions include: revenue trends, funding history, why they scored HOT/WARM/COLD, comparison to industry benchmarks, suggested outreach strategy.\n\n${fullSystemPrompt}`;
  }

  // Combine system prompt with user message
  const fullPrompt = `${fullSystemPrompt}\n\nUser: ${userMessage}\nAssistant:`;

  const response = await genAI.models.generateContent({
    model: modelName,
    contents: fullPrompt,
    config: {
      temperature: 0.7,
    },
  });

  const chatbotResponse = response.text;

  return {
    ...input,
    response: chatbotResponse,
    personality,
    hasCompanyContext: !!(companyContext || input?.companyName),
    usage: {
      promptTokens: (response as any).usageMetadata?.promptTokenCount || 0,
      completionTokens: (response as any).usageMetadata?.candidatesTokenCount || 0,
      totalTokens: (response as any).usageMetadata?.totalTokenCount || 0,
    },
  };
}

async function executeDataExtractor(
  config: any,
  input: any,
  genAI: GoogleGenAI,
  modelName: string
) {
  let { text, schema } = config;

  // Process template variables
  text = replaceTemplateVariables(text, input);
  schema = replaceTemplateVariables(schema, input);

  const systemPrompt = `Extract information from the text according to this schema: ${schema}. Return ONLY a valid JSON object matching the schema, with no additional text or explanation.`;

  const fullPrompt = `${systemPrompt}\n\nText to extract from:\n${text}`;

  const response = await genAI.models.generateContent({
    model: modelName,
    contents: fullPrompt,
    config: {
      temperature: 0.1,
    },
  });

  const extractedData = response.text;

  try {
    if (!extractedData) throw new Error("No data extracted");

    // Try to extract JSON from the response (Gemini might wrap it in markdown)
    let jsonString = extractedData.trim();
    // Remove markdown code blocks if present
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    }
    const parsed = JSON.parse(jsonString);
    return {
      extractedData: parsed,
      schema,
      usage: {
        promptTokens: (response as any).usageMetadata?.promptTokenCount || 0,
        completionTokens: (response as any).usageMetadata?.candidatesTokenCount || 0,
        totalTokens: (response as any).usageMetadata?.totalTokenCount || 0,
      },
    };
  } catch (e) {
    return {
      extractedData: extractedData || "",
      schema,
      usage: {
        promptTokens: (response as any).usageMetadata?.promptTokenCount || 0,
        completionTokens: (response as any).usageMetadata?.candidatesTokenCount || 0,
        totalTokens: (response as any).usageMetadata?.totalTokenCount || 0,
      },
      note: "Could not parse as JSON, returning raw text",
    };
  }
}

async function executeResearchAgent(
  config: any,
  input: any,
  genAI: GoogleGenAI,
  modelName: string
) {
  let { companyName, domain, industry, city, companySize, intent } = config;

  // Replace template variables
  companyName = replaceTemplateVariables(companyName, input);
  domain = replaceTemplateVariables(domain, input);
  industry = replaceTemplateVariables(industry, input);
  city = replaceTemplateVariables(city, input);
  companySize = replaceTemplateVariables(companySize, input);
  intent = replaceTemplateVariables(intent, input);

  const systemPrompt = `You are a B2B business intelligence analyst. Research the company and extract structured data. Be factual and concise. If data is unavailable, say so — do not invent numbers.`;

  const userPrompt = `Research this company:
- Name: ${companyName}
- Domain: ${domain}
- Industry: ${industry || "Unknown"}
- Location: ${city || "Unknown"}
- Size: ${companySize || "Unknown"}
- Stated intent: ${intent || "Not provided"}

Find and return:
1. What the company actually does (2-3 sentences)
2. Founding year (if findable)
3. Headquarters location
4. Employee count estimate
5. Key products or services
6. Recent notable news (last 12 months)
7. Tech stack signals (from job postings, BuiltWith, etc.)
8. Any public financial signals (funding rounds, revenue mentions)
9. Key competitors
10. Overall company health impression (1 sentence)
11. Estimated Revenue History (last 5 years, numeric millions for charting)
12. Estimated Hiring Trend (last 6 months headcount for charting)
13. Brand Sentiment Analysis (0-100 split for Positive/Neutral/Negative)
14. Intent Analysis (Score 1-10 on 4-5 topics related to their buying intent)
15. Competitor Market Share (Estimated percentages)

Return as structured JSON only with these exact keys:
{
  "companyDescription": "string",
  "foundedYear": "number or null",
  "hq": "string or null",
  "employeeEstimate": "number or null",
  "products": ["string"],
  "recentNews": ["string"],
  "techStack": ["string"],
  "financialSignals": ["string"],
  "competitors": ["string"],
  "healthImpression": "string",
  "revenueHistory": [{"year": "string", "revenue": "number (in millions)"}],
  "hiringTrend": [{"month": "string", "headcount": "number"}],
  "sentiment": {"positive": "number", "neutral": "number", "negative": "number"},
  "intentAnalysis": [{"topic": "string", "score": "number"}],
  "competitorMarketShare": [{"name": "string", "share": "number"}]
}`;

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  const response = await genAI.models.generateContent({
    model: modelName,
    contents: fullPrompt,
    config: {
      temperature: 0.3,
    },
  });

  const rawText = response.text || "";

  // Try to parse JSON from response
  let researchData: any = {};
  try {
    let jsonString = rawText.trim();
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    }
    researchData = JSON.parse(jsonString);
  } catch (e) {
    researchData = { rawResearch: rawText, parseError: true };
  }

  return {
    ...researchData,
    companyName,
    domain,
    industry,
    city,
    companySize,
    intent,
    researchedAt: new Date().toISOString(),
    usage: {
      promptTokens: (response as any).usageMetadata?.promptTokenCount || 0,
      completionTokens: (response as any).usageMetadata?.candidatesTokenCount || 0,
      totalTokens: (response as any).usageMetadata?.totalTokenCount || 0,
    },
  };
}

async function executeScoreEngine(
  config: any,
  input: any,
  genAI: GoogleGenAI,
  modelName: string
) {
  // Step 1: Deterministic signal scoring
  const d = input || {};
  let score = 0;
  const signals: string[] = [];

  // Revenue signals
  const revenue = d.revenue || d.enrichment?.revenue || null;
  if (revenue) {
    const rev = typeof revenue === "number" ? revenue : parseFloat(String(revenue).replace(/[^0-9.]/g, ""));
    if (rev > 100_000_000) { score += 30; signals.push("Revenue >$100M"); }
    else if (rev > 10_000_000) { score += 20; signals.push("Revenue >$10M"); }
    else if (rev > 1_000_000) { score += 10; signals.push("Revenue >$1M"); }
  }

  // Growth signals
  const revenueGrowth = d.revenueGrowth || d.enrichment?.revenueGrowth || null;
  if (revenueGrowth) {
    const growth = typeof revenueGrowth === "number" ? revenueGrowth : parseFloat(String(revenueGrowth));
    if (growth > 0.3) { score += 20; signals.push("Revenue growth >30%"); }
    else if (growth > 0.1) { score += 10; signals.push("Revenue growth >10%"); }
  }

  // Headcount
  const employeeCount = d.employeeEstimate || d.employeeCount || d.enrichment?.employeeCount || null;
  if (employeeCount) {
    const count = typeof employeeCount === "number" ? employeeCount : parseInt(String(employeeCount));
    if (count > 500) { score += 10; signals.push("Large team (500+)"); }
    else if (count > 50) { score += 5; signals.push("Mid-size team (50+)"); }
  }

  // Funding signals
  const totalFunding = d.totalFunding || d.enrichment?.totalFunding || null;
  const latestFundingDate = d.latestFundingDate || d.enrichment?.latestFundingDate || null;
  if (totalFunding) {
    if (latestFundingDate) {
      const fundingDate = new Date(latestFundingDate);
      const now = new Date();
      const monthsDiff = (now.getFullYear() - fundingDate.getFullYear()) * 12 + (now.getMonth() - fundingDate.getMonth());
      if (monthsDiff < 6) { score += 25; signals.push("Funded <6 months ago"); }
      else if (monthsDiff < 18) { score += 15; signals.push("Funded <18 months ago"); }
      else { score += 5; signals.push("Has funding history"); }
    } else {
      score += 5; signals.push("Has funding history");
    }
  }

  // Web traffic
  const trafficGrowth = d.trafficGrowthMoM || d.enrichment?.trafficGrowthMoM || null;
  if (trafficGrowth) {
    const tg = typeof trafficGrowth === "number" ? trafficGrowth : parseFloat(String(trafficGrowth));
    if (tg > 0.2) { score += 10; signals.push("Traffic growing >20% MoM"); }
  }

  // Company size from form
  if (d.companySize === "201–1000" || d.companySize === "1000+") {
    score += 5; signals.push("Self-reported mid-to-large company");
  }

  score = Math.min(score, 100);

  // Determine numeric tier
  const hotThreshold = parseInt(config.hotThreshold || "70");
  const warmThreshold = parseInt(config.warmThreshold || "40");
  let numericTier = "COLD";
  if (score >= hotThreshold) numericTier = "HOT";
  else if (score >= warmThreshold) numericTier = "WARM";

  // Step 2: AI verdict
  const aiSystemPrompt = `You are a B2B sales qualification expert. Given a company's financial and growth profile, assess if they are a high-value lead. Be direct and concise.`;

  const aiUserPrompt = `Company data:
${JSON.stringify(input, null, 2)}

Numeric score: ${score}/100 (tier: ${numericTier})
Signals detected: ${signals.join(", ") || "None"}
Original intent from form: ${d.intent || "Not provided"}

Based on ALL of this data, provide your assessment as JSON only:
{
  "aiVerdict": "HOT or WARM or COLD",
  "confidence": 0.0 to 1.0,
  "reasoning": "2-3 sentence explanation",
  "greenFlags": ["string array of positive signals"],
  "redFlags": ["string array of concerns"],
  "recommendedAction": "Call within 24 hours | Add to nurture | Monitor only",
  "estimatedDealSize": "string or null",
  "bestAngle": "What pain point to lead with in outreach"
}`;

  const fullPrompt = `${aiSystemPrompt}\n\n${aiUserPrompt}`;

  let aiResult: any = {};
  try {
    const response = await genAI.models.generateContent({
      model: modelName,
      contents: fullPrompt,
      config: {
        temperature: 0.4,
      },
    });

    const rawText = response.text || "";
    let jsonString = rawText.trim();
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    }
    aiResult = JSON.parse(jsonString);
  } catch (e) {
    aiResult = {
      aiVerdict: numericTier,
      confidence: 0.5,
      reasoning: "AI verdict unavailable — using numeric score only.",
      greenFlags: signals,
      redFlags: [],
      recommendedAction: numericTier === "HOT" ? "Call within 24 hours" : numericTier === "WARM" ? "Add to nurture" : "Monitor only",
      estimatedDealSize: null,
      bestAngle: "Unable to determine — review manually",
    };
  }

  return {
    ...input,
    score,
    numericTier,
    signals,
    ...aiResult,
    scoredAt: new Date().toISOString(),
  };
}
