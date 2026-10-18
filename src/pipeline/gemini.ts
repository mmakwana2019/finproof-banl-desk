import { GoogleGenAI } from "@google/genai";
import type { PipelineResult } from "../types.ts";

function getGeminiClient(): GoogleGenAI | null {
  // Try to find GEMINI_API_KEY from environment or import.meta.env
  const apiKey =
    (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== "undefined" && (import.meta as unknown as { env?: { VITE_GEMINI_API_KEY?: string } }).env?.VITE_GEMINI_API_KEY);

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function draftWithGemini(
  result: PipelineResult,
  party: string,
  workflow: string,
): Promise<{ staffNote: string; customerNote: string } | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const checksText = result.checks
      .map(
        (c) =>
          `- Rule ${c.ruleId} (${c.title}): Pass=${c.pass}. Cited quote: "${c.quote}". Plain finding: ${c.plain}`,
      )
      .join("\n");

    const prompt = `You are FinProof Desk's AI compliance officer.
Party: ${party}
Workflow: ${workflow}
Decision Recommendation: ${result.recommendation}
Overall Risk Score: ${result.overallRiskScore}/100

Evaluated Findings:
${checksText}

Please draft two distinct communications based ONLY on the cited findings above:
1. STAFF_NOTE: An internal compliance memorandum for the risk file. Detail the decision, cited evidence, and audit recommendation.
2. CUSTOMER_NOTE: A formal letter or email to ${party}. If Approved, confirm clearance. If Query, clearly ask for the specific discrepancy without technical jargon. If Escalate, explain that secondary review is underway.

Return strictly JSON in this format:
{
  "staffNote": "...",
  "customerNote": "..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim();
    if (!text) return null;

    const parsed = JSON.parse(text);
    if (parsed.staffNote && parsed.customerNote) {
      return {
        staffNote: parsed.staffNote,
        customerNote: parsed.customerNote,
      };
    }
  } catch (err) {
    console.warn("Gemini drafting error (falling back to grounded engine):", err);
  }
  return null;
}

export async function askWithGemini(
  question: string,
  evidence: string,
): Promise<{ answer: string; gemini: boolean }> {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      answer: `[Desk Intelligence Engine]: Based on the case record, here are the key matching terms:\n${evidence
        .split("\n")
        .filter((l) => l.trim().length > 0)
        .slice(0, 4)
        .map((l) => `• ${l.trim()}`)
        .join("\n")}`,
      gemini: false,
    };
  }

  try {
    const prompt = `You are FinProof Desk's BFSI expert assistant.
A case handler is examining the following document packet evidence:
---
${evidence.slice(0, 6000)}
---

Question from case handler: "${question}"

Provide a concise, direct, professional answer citing specific line items, names, or values from the evidence above. Keep under 3 paragraphs.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return {
      answer: response.text?.trim() || "No answer generated.",
      gemini: true,
    };
  } catch (err) {
    console.warn("Gemini Q&A fallback:", err);
    return {
      answer: `Based on the case documents, review the cited quotes in the findings panel for exact verification.`,
      gemini: false,
    };
  }
}
