import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeCV = async (cvText: string): Promise<AnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
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
    });

    const text = response.response.text();

    const cleaned = text
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned || "{}") as AnalysisResult;
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("Failed to analyze CV");
  }
};
