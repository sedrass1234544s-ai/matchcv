import { AnalysisResult } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const analyzeCV = async (cvText: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Analyze the following CV and return ONLY valid JSON.

CV:
${cvText}

JSON format:
{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "photo_feedback": string,
  "improvements": string[],
  "action_items": string[]
}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned || "{}");
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("Failed to analyze CV");
  }
};
