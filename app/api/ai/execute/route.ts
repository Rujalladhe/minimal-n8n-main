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
  let { systemPrompt, userMessage, personality } = config;

  // Process template variables
  systemPrompt = replaceTemplateVariables(systemPrompt, input);
  userMessage = replaceTemplateVariables(userMessage, input);

  const personalityPrompts = {
    professional: "Respond in a professional and formal manner.",
    friendly: "Respond in a warm, friendly, and conversational manner.",
    concise: "Respond with brief, to-the-point answers.",
  };

  const fullSystemPrompt = `${systemPrompt}\n\n${personalityPrompts[personality as keyof typeof personalityPrompts] || ""
    }`;

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
    response: chatbotResponse,
    personality,
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
