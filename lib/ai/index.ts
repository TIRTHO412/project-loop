import { Sentiment } from "@prisma/client";

export interface AIAnalysisResult {
  sentiment: Sentiment;
  sentimentScore: number; // Scale 0 (strongly negative) to 100 (strongly positive)
  confidence: number;     // Scale 0.00 to 1.00
  summary: string;
  category: string;
  themes: string[];
  recommendations: string[];
  model: string;
  analyzedAt: string;
}

/**
 * Centralized AI Service Abstraction for Customer Feedback Intelligence
 * Supports OpenAI API if OPENAI_API_KEY is set, with an intelligent NLP heuristic fallback.
 */
export async function analyzeFeedbackWithAI(
  content: string,
  title?: string
): Promise<AIAnalysisResult> {
  const fullText = `${title ? title + ". " : ""}${content}`;
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey && apiKey.startsWith("sk-") && !apiKey.includes("your-openai-api-key")) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are an expert AI Customer Feedback Intelligence engine. Analyze the customer review/feedback and return a strict JSON object with:
- "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE"
- "sentimentScore": number between 0 (extreme negative) and 100 (extreme positive)
- "confidence": number between 0.50 and 1.00
- "summary": concise 1-2 sentence executive summary
- "category": one of ["Performance & Speed", "Customer Support", "Pricing & Plans", "UX & Interface", "Bugs & Errors", "Feature Requests", "General"]
- "themes": array of 1 to 3 specific issue/theme tags
- "recommendations": array of 1 to 2 suggested product actions`,
            },
            {
              role: "user",
              content: `Customer Feedback Text: "${fullText}"`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);

        return {
          sentiment:
            parsed.sentiment === "POSITIVE"
              ? Sentiment.POSITIVE
              : parsed.sentiment === "NEGATIVE"
              ? Sentiment.NEGATIVE
              : Sentiment.NEUTRAL,
          sentimentScore: Math.min(100, Math.max(0, Number(parsed.sentimentScore) || 50)),
          confidence: Math.min(1.0, Math.max(0.5, Number(parsed.confidence) || 0.9)),
          summary: parsed.summary || "Summary generated successfully.",
          category: parsed.category || "General",
          themes: Array.isArray(parsed.themes) ? parsed.themes : ["General Feedback"],
          recommendations: Array.isArray(parsed.recommendations)
            ? parsed.recommendations
            : ["Monitor feedback trend."],
          model: "gpt-4o-mini",
          analyzedAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn("OpenAI API call failed, using intelligent NLP fallback:", err);
    }
  }

  // Fallback Rule-based NLP Engine when OPENAI_API_KEY is not configured
  return runLocalHeuristicAnalysis(fullText);
}

/**
 * Intelligent Rule-Based Local Heuristic NLP Engine
 */
function runLocalHeuristicAnalysis(text: string): AIAnalysisResult {
  const lower = text.toLowerCase();

  const positiveWords = ["save", "saved", "love", "loved", "great", "faster", "fast", "awesome", "excellent", "accurate", "solved", "fixed", "best", "boost", "helpful", "easy"];
  const negativeWords = ["slow", "glitch", "glitching", "bug", "error", "steep", "expensive", "fail", "failed", "struggling", "issue", "problem", "broken", "terrible", "worst", "hard"];

  let posScore = 0;
  let negScore = 0;

  positiveWords.forEach((w) => {
    if (lower.includes(w)) posScore += 1;
  });
  negativeWords.forEach((w) => {
    if (lower.includes(w)) negScore += 1;
  });

  let sentiment: Sentiment = Sentiment.NEUTRAL;
  let sentimentScore = 50;

  if (posScore > negScore) {
    sentiment = Sentiment.POSITIVE;
    sentimentScore = Math.min(98, 70 + posScore * 8);
  } else if (negScore > posScore) {
    sentiment = Sentiment.NEGATIVE;
    sentimentScore = Math.max(5, 40 - negScore * 10);
  } else {
    sentiment = Sentiment.NEUTRAL;
    sentimentScore = 52;
  }

  // Category Detection
  let category = "General";
  let themes: string[] = [];

  if (lower.includes("speed") || lower.includes("slow") || lower.includes("load") || lower.includes("performance")) {
    category = "Performance & Speed";
    themes.push("Performance & Load Times");
  }
  if (lower.includes("support") || lower.includes("help") || lower.includes("ticket") || lower.includes("alex")) {
    category = "Customer Support";
    themes.push("Customer Support Speed");
  }
  if (lower.includes("price") || lower.includes("pricing") || lower.includes("tier") || lower.includes("cost") || lower.includes("$")) {
    category = "Pricing & Plans";
    themes.push("Pricing & Tier Flexibility");
  }
  if (lower.includes("mobile") || lower.includes("ui") || lower.includes("onboarding") || lower.includes("drawer") || lower.includes("safari")) {
    category = "UX & Interface";
    themes.push("UI / Mobile Responsiveness");
  }
  if (lower.includes("export") || lower.includes("csv") || lower.includes("slack") || lower.includes("feature") || lower.includes("request")) {
    category = "Feature Requests";
    themes.push("Export Data Formatting");
  }

  if (themes.length === 0) {
    themes.push("Product Quality");
  }

  const summary = `Customer highlights ${
    sentiment === Sentiment.POSITIVE
      ? "positive satisfaction and efficiency improvements"
      : sentiment === Sentiment.NEGATIVE
      ? "critical friction points requiring resolution"
      : "neutral observations regarding current features"
  } related to ${category}.`;

  return {
    sentiment,
    sentimentScore,
    confidence: 0.92,
    summary,
    category,
    themes,
    recommendations: [
      sentiment === Sentiment.NEGATIVE
        ? "Prioritize product engineering ticket for rapid fix."
        : "Share customer quote with product and marketing team.",
    ],
    model: "loop-nlp-engine-v2 (Local)",
    analyzedAt: new Date().toISOString(),
  };
}
