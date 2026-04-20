import {
  Webhook,
  Clock,
  Sparkles,
  Brain,
  MessageSquare,
  FileSearch,
  Globe,
  Code,
  Mail,
  GitBranch,
  Timer,
  Search,
  Target,
  Filter,
  BarChart3,
  Eye,
} from "lucide-react";

export interface NodeDefinition {
  type: string;
  label: string;
  description: string;
  category: "trigger" | "ai" | "action" | "logic";
  icon: any;
  color: string;
  defaultConfig: Record<string, any>;
  configFields: ConfigField[];
}

export interface ConfigField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: any;
}

export const nodeDefinitions: Record<string, NodeDefinition> = {
  webhook: {
    type: "webhook",
    label: "Webhook Trigger",
    description: "Triggers workflow when receiving HTTP request",
    category: "trigger",
    icon: Webhook,
    color: "bg-blue-500",
    defaultConfig: {
      method: "POST",
      path: "/webhook",
    },
    configFields: [
      {
        name: "method",
        label: "HTTP Method",
        type: "select",
        options: [
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
        ],
        defaultValue: "POST",
      },
      {
        name: "path",
        label: "Webhook Path",
        type: "text",
        placeholder: "/webhook",
        defaultValue: "/webhook",
      },
    ],
  },

  schedule: {
    type: "schedule",
    label: "Schedule Trigger",
    description: "Runs workflow on a schedule",
    category: "trigger",
    icon: Clock,
    color: "bg-purple-500",
    defaultConfig: {
      interval: "5",
      unit: "minutes",
    },
    configFields: [
      {
        name: "interval",
        label: "Interval",
        type: "number",
        placeholder: "5",
        defaultValue: "5",
      },
      {
        name: "unit",
        label: "Unit",
        type: "select",
        options: [
          { value: "minutes", label: "Minutes" },
          { value: "hours", label: "Hours" },
          { value: "days", label: "Days" },
        ],
        defaultValue: "minutes",
      },
    ],
  },

  aiTextGenerator: {
    type: "aiTextGenerator",
    label: "AI Text Generator",
    description: "Generate text using Google Gemini",
    category: "ai",
    icon: Sparkles,
    color: "bg-gradient-to-r from-pink-500 to-purple-500",
    defaultConfig: {
      prompt: "Write a professional email",
      temperature: "0.7",
      maxTokens: "500",
    },
    configFields: [
      {
        name: "prompt",
        label: "Prompt",
        type: "textarea",
        placeholder: "Enter your prompt here...",
        required: true,
      },
      {
        name: "temperature",
        label: "Temperature",
        type: "number",
        placeholder: "0.7",
        defaultValue: "0.7",
      },
      {
        name: "maxTokens",
        label: "Max Tokens",
        type: "number",
        placeholder: "500",
        defaultValue: "500",
      },
    ],
  },

  aiAnalyzer: {
    type: "aiAnalyzer",
    label: "AI Content Analyzer",
    description: "Analyze content with AI (sentiment, keywords, summary)",
    category: "ai",
    icon: Brain,
    color: "bg-gradient-to-r from-cyan-500 to-blue-500",
    defaultConfig: {
      analysisType: "sentiment",
      text: "",
    },
    configFields: [
      {
        name: "text",
        label: "Text to Analyze",
        type: "textarea",
        placeholder: "Enter text to analyze...",
        required: true,
      },
      {
        name: "analysisType",
        label: "Analysis Type",
        type: "select",
        options: [
          { value: "sentiment", label: "Sentiment Analysis" },
          { value: "keywords", label: "Extract Keywords" },
          { value: "summary", label: "Summarize" },
        ],
        defaultValue: "sentiment",
      },
    ],
  },

  aiChatbot: {
    type: "aiChatbot",
    label: "AI Chatbot",
    description: "Generate chatbot responses",
    category: "ai",
    icon: MessageSquare,
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
    defaultConfig: {
      systemPrompt: "You are a helpful assistant.",
      userMessage: "",
      personality: "professional",
    },
    configFields: [
      {
        name: "systemPrompt",
        label: "System Prompt",
        type: "textarea",
        placeholder: "You are a helpful assistant...",
        defaultValue: "You are a helpful assistant.",
      },
      {
        name: "userMessage",
        label: "User Message",
        type: "textarea",
        placeholder: "User message...",
        required: true,
      },
      {
        name: "personality",
        label: "Personality",
        type: "select",
        options: [
          { value: "professional", label: "Professional" },
          { value: "friendly", label: "Friendly" },
          { value: "concise", label: "Concise" },
        ],
        defaultValue: "professional",
      },
    ],
  },

  aiDataExtractor: {
    type: "aiDataExtractor",
    label: "AI Data Extractor",
    description: "Extract structured data from text",
    category: "ai",
    icon: FileSearch,
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    defaultConfig: {
      text: "",
      schema: '{"name": "string", "email": "string"}',
    },
    configFields: [
      {
        name: "text",
        label: "Text Input",
        type: "textarea",
        placeholder: "Enter unstructured text...",
        required: true,
      },
      {
        name: "schema",
        label: "Expected Schema (JSON)",
        type: "textarea",
        placeholder: '{"name": "string", "email": "string"}',
        required: true,
      },
    ],
  },

  httpRequest: {
    type: "httpRequest",
    label: "HTTP Request",
    description: "Make HTTP requests to APIs",
    category: "action",
    icon: Globe,
    color: "bg-green-500",
    defaultConfig: {
      method: "GET",
      url: "https://api.example.com",
      headers: "{}",
      body: "{}",
    },
    configFields: [
      {
        name: "method",
        label: "Method",
        type: "select",
        options: [
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
          { value: "DELETE", label: "DELETE" },
        ],
        defaultValue: "GET",
      },
      {
        name: "url",
        label: "URL",
        type: "text",
        placeholder: "https://api.example.com",
        required: true,
      },
      {
        name: "headers",
        label: "Headers (JSON)",
        type: "textarea",
        placeholder: '{"Content-Type": "application/json"}',
        defaultValue: "{}",
      },
      {
        name: "body",
        label: "Body (JSON)",
        type: "textarea",
        placeholder: '{"key": "value"}',
        defaultValue: "{}",
      },
    ],
  },

  dataTransform: {
    type: "dataTransform",
    label: "Data Transform",
    description: "Transform data using JavaScript",
    category: "action",
    icon: Code,
    color: "bg-yellow-500",
    defaultConfig: {
      code: "return { ...input, transformed: true };",
    },
    configFields: [
      {
        name: "code",
        label: "Transformation Code",
        type: "textarea",
        placeholder: "return { ...input, transformed: true };",
        required: true,
      },
    ],
  },

  sendEmail: {
    type: "sendEmail",
    label: "Send Email",
    description: "Send email via SMTP",
    category: "action",
    icon: Mail,
    color: "bg-red-500",
    defaultConfig: {
      to: "user@example.com",
      subject: "AI Generated Content",
      body: "{{input.generatedText}}",
      from: "",
    },
    configFields: [
      {
        name: "to",
        label: "To",
        type: "text",
        placeholder: "user@example.com",
        required: true,
      },
      {
        name: "subject",
        label: "Subject",
        type: "text",
        placeholder: "Email subject (use {{input.field}} for dynamic content)",
        required: true,
      },
      {
        name: "body",
        label: "Body",
        type: "textarea",
        placeholder: "{{input.generatedText}} - Use {{input.generatedText}} to include AI-generated content",
        required: true,
      },
      {
        name: "from",
        label: "From (optional)",
        type: "text",
        placeholder: "sender@example.com (uses SMTP_FROM if not set)",
        required: false,
      },
    ],
  },

  ifElse: {
    type: "ifElse",
    label: "If/Else",
    description: "Conditional logic",
    category: "logic",
    icon: GitBranch,
    color: "bg-indigo-500",
    defaultConfig: {
      condition: "input.value > 10",
      operator: "javascript",
    },
    configFields: [
      {
        name: "condition",
        label: "Condition",
        type: "text",
        placeholder: "input.value > 10",
        required: true,
      },
      {
        name: "operator",
        label: "Operator",
        type: "select",
        options: [
          { value: "javascript", label: "JavaScript Expression" },
          { value: "equals", label: "Equals" },
          { value: "contains", label: "Contains" },
        ],
        defaultValue: "javascript",
      },
    ],
  },

  delay: {
    type: "delay",
    label: "Delay",
    description: "Wait for specified time",
    category: "logic",
    icon: Timer,
    color: "bg-gray-500",
    defaultConfig: {
      duration: "1000",
      unit: "milliseconds",
    },
    configFields: [
      {
        name: "duration",
        label: "Duration",
        type: "number",
        placeholder: "1000",
        required: true,
      },
      {
        name: "unit",
        label: "Unit",
        type: "select",
        options: [
          { value: "milliseconds", label: "Milliseconds" },
          { value: "seconds", label: "Seconds" },
        ],
        defaultValue: "milliseconds",
      },
    ],
  },

  researchAgent: {
    type: "researchAgent",
    label: "Research Agent",
    description: "AI-powered company research & intelligence",
    category: "ai",
    icon: Search,
    color: "bg-gradient-to-r from-purple-500 to-indigo-500",
    defaultConfig: {
      companyName: "{{input.companyName}}",
      domain: "{{input.domain}}",
      industry: "{{input.industry}}",
      city: "{{input.city}}",
      companySize: "{{input.companySize}}",
      intent: "{{input.intent}}",
    },
    configFields: [
      {
        name: "companyName",
        label: "Company Name",
        type: "text",
        placeholder: "{{input.companyName}}",
        required: true,
      },
      {
        name: "domain",
        label: "Domain",
        type: "text",
        placeholder: "{{input.domain}}",
        required: true,
      },
      {
        name: "industry",
        label: "Industry",
        type: "text",
        placeholder: "{{input.industry}}",
      },
      {
        name: "city",
        label: "City / Location",
        type: "text",
        placeholder: "{{input.city}}",
      },
      {
        name: "companySize",
        label: "Company Size",
        type: "text",
        placeholder: "{{input.companySize}}",
      },
      {
        name: "intent",
        label: "Stated Intent",
        type: "textarea",
        placeholder: "{{input.intent}}",
      },
    ],
  },

  aiScoreEngine: {
    type: "aiScoreEngine",
    label: "AI Scoring Engine",
    description: "Score & qualify leads with deterministic signals + AI verdict",
    category: "ai",
    icon: Target,
    color: "bg-gradient-to-r from-amber-500 to-orange-500",
    defaultConfig: {
      hotThreshold: "70",
      warmThreshold: "40",
    },
    configFields: [
      {
        name: "hotThreshold",
        label: "HOT Threshold (score ≥)",
        type: "number",
        placeholder: "70",
        defaultValue: "70",
      },
      {
        name: "warmThreshold",
        label: "WARM Threshold (score ≥)",
        type: "number",
        placeholder: "40",
        defaultValue: "40",
      },
    ],
  },

  leadClassifier: {
    type: "leadClassifier",
    label: "Lead Classifier",
    description: "Classify leads as HOT / WARM / COLD based on score",
    category: "logic",
    icon: Filter,
    color: "bg-gradient-to-r from-rose-500 to-red-500",
    defaultConfig: {
      hotThreshold: "70",
      warmThreshold: "40",
    },
    configFields: [
      {
        name: "hotThreshold",
        label: "HOT Threshold (score ≥)",
        type: "number",
        placeholder: "70",
        defaultValue: "70",
      },
      {
        name: "warmThreshold",
        label: "WARM Threshold (score ≥)",
        type: "number",
        placeholder: "40",
        defaultValue: "40",
      },
    ],
  },

  kpiDashboard: {
    type: "kpiDashboard",
    label: "KPI Dashboard",
    description: "Visual lead intelligence dashboard with score gauge & KPIs",
    category: "action",
    icon: BarChart3,
    color: "bg-gradient-to-r from-emerald-500 to-cyan-500",
    defaultConfig: {
      showChatbotLink: "true",
    },
    configFields: [
      {
        name: "showChatbotLink",
        label: "Show Chatbot Link",
        type: "select",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
        defaultValue: "true",
      },
    ],
  },

  websiteTracker: {
    type: "websiteTracker",
    label: "Website Tracker",
    description: "Track visitor behavior on any website (B2C)",
    category: "trigger",
    icon: Eye,
    color: "bg-gradient-to-r from-teal-500 to-cyan-500",
    defaultConfig: {
      websiteUrl: "",
      siteName: "",
      trackClicks: "true",
      trackScroll: "true",
      trackTime: "true",
    },
    configFields: [
      {
        name: "websiteUrl",
        label: "Website URL",
        type: "text",
        placeholder: "https://example.com",
        required: true,
      },
      {
        name: "siteName",
        label: "Site Name",
        type: "text",
        placeholder: "My Website",
      },
      {
        name: "trackClicks",
        label: "Track Clicks",
        type: "select",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
        defaultValue: "true",
      },
      {
        name: "trackScroll",
        label: "Track Scroll Depth",
        type: "select",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
        defaultValue: "true",
      },
      {
        name: "trackTime",
        label: "Track Time on Page",
        type: "select",
        options: [
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ],
        defaultValue: "true",
      },
    ],
  },
};

