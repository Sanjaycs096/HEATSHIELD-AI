import { AssessmentInput, RiskAssessment } from "./riskEngine";
import { EnvironmentalSnapshot } from "./envService";

export interface AIActionPlan {
  summary: string;
  keyFactors: {
    factor: string;
    explanation: string;
  }[];
  actions: {
    priority: "HIGH" | "MEDIUM" | "LOW";
    title: string;
    description: string;
    category: string;
  }[];
  scheduleGuidance: string;
  caution: string;
  language: "en" | "ta";
  generatedBy: "groq" | "fallback";
}

export interface AIContext {
  userContext: {
    location?: string;
    userType?: string;
    preferredLanguage?: string;
  };
  assessment: AssessmentInput;
  environment: EnvironmentalSnapshot;
  riskAssessment: RiskAssessment;
}

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama3-8b-8192";

function generateFallbackActionPlan(context: AIContext): AIActionPlan {
  const isTa = context.userContext.preferredLanguage === 'ta';
  
  const summaryEn = `Based on your assessment, the current risk level is ${context.riskAssessment.level} (${context.riskAssessment.score}/100) due to ${context.riskAssessment.primaryConcern}. Standard safety precautions apply.`;
  const summaryTa = `உங்கள் மதிப்பீட்டின் அடிப்படையில், தற்போதைய ஆபத்து நிலை ${context.riskAssessment.level} (${context.riskAssessment.score}/100) ஆகும். இது ${context.riskAssessment.primaryConcern} காரணமாக உள்ளது. நிலையான பாதுகாப்பு முன்னெச்சரிக்கைகளைப் பின்பற்றவும்.`;

  const cautionEn = "Standard safety guidance. Not a medical diagnosis.";
  const cautionTa = "நிலையான பாதுகாப்பு வழிகாட்டுதல். இது ஒரு மருத்துவ அறிக்கை அல்ல.";

  return {
    summary: isTa ? summaryTa : summaryEn,
    keyFactors: context.riskAssessment.factors
      .filter(f => f.available)
      .map(f => ({
        factor: f.name,
        explanation: f.reason
      })),
    actions: [
      {
        priority: "HIGH",
        title: isTa ? "நீரேற்றத்துடன் இருங்கள்" : "Stay Hydrated",
        description: isTa ? "வழக்கமான இடைவெளியில் போதுமான தண்ணீர் குடிக்கவும்." : "Drink plenty of water at regular intervals.",
        category: "hydration"
      },
      {
        priority: "MEDIUM",
        title: isTa ? "நிழலில் ஓய்வு" : "Rest in Shade",
        description: isTa ? "வெயிலின் தாக்கத்தை குறைக்க நிழலான இடங்களில் ஓய்வு எடுக்கவும்." : "Take breaks in shaded areas to reduce heat stress.",
        category: "rest"
      }
    ],
    scheduleGuidance: isTa ? "அதிக உஷ்ணமான நேரங்களில் வெளி வேலைகளை தவிர்க்கவும்." : "Consider avoiding outdoor work during peak heat hours.",
    caution: isTa ? cautionTa : cautionEn,
    language: isTa ? "ta" : "en",
    generatedBy: "fallback"
  };
}

// Basic prompt injection/forbidden claim filter
function containsForbiddenClaims(jsonStr: string): boolean {
  const lower = jsonStr.toLowerCase();
  const forbidden = [
    "you have heatstroke",
    "you will get heatstroke",
    "you are medically safe",
    "you are medically unsafe",
    "official warning",
    "guaranteed"
  ];
  return forbidden.some(term => lower.includes(term));
}

export async function generateActionPlan(context: AIContext): Promise<AIActionPlan> {
  // Graceful fallback if no key
  if (!GROQ_API_KEY) {
    return generateFallbackActionPlan(context);
  }

  const prompt = `
You are HeatShield AI's safety-planning assistant. 
Your task is to convert structured environmental and deterministic risk information into practical, personalized planning guidance.
Output MUST be strictly valid JSON matching the specified schema.

# RESTRICTIONS:
- NO medical diagnosis.
- NO fabricated data or official warnings.
- DO NOT change the risk score or risk level.
- Output MUST be in ${context.userContext.preferredLanguage === 'ta' ? 'Tamil (ta)' : 'English (en)'}.

# INPUT CONTEXT:
Risk Score: ${context.riskAssessment.score}/100
Risk Level: ${context.riskAssessment.level}
Primary Concern: ${context.riskAssessment.primaryConcern}
Activity: ${context.assessment.activityType} (${context.assessment.intensity} intensity)
Schedule: ${context.assessment.startTime} to ${context.assessment.endTime}

# JSON SCHEMA:
{
  "summary": "Concise summary",
  "keyFactors": [{"factor": "Name", "explanation": "Reason"}],
  "actions": [{"priority": "HIGH"|"MEDIUM"|"LOW", "title": "Action", "description": "Details", "category": "category"}],
  "scheduleGuidance": "Schedule advice",
  "caution": "Safety disclaimer",
  "language": "en" | "ta",
  "generatedBy": "groq"
}
`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Groq API error");
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;

    if (containsForbiddenClaims(resultText)) {
      throw new Error("Forbidden claim detected in output");
    }

    const plan = JSON.parse(resultText) as AIActionPlan;
    
    // Validate schema basic
    if (!plan.summary || !plan.actions || !Array.isArray(plan.actions)) {
      throw new Error("Invalid schema");
    }
    
    // Normalize language and generator
    plan.generatedBy = "groq";
    plan.language = context.userContext.preferredLanguage === 'ta' ? 'ta' : 'en';

    // Normalize length limits
    plan.summary = plan.summary.substring(0, 300);
    plan.scheduleGuidance = plan.scheduleGuidance?.substring(0, 200) || "";

    return plan;
  } catch {
    // Retry once conceptually? For simplicity in this function, we fallback on failure.
    // In a real app we'd have a wrapper with a retry block.
    return generateFallbackActionPlan(context);
  }
}
