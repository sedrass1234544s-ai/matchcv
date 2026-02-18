import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeCV = async (imageData: string, mimeType: string): Promise<AnalysisResult> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageData.split(",")[1],
            },
          },
          {
            text: `Analyze this CV/Resume. Return ONLY valid JSON with:
{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "photo_feedback": string,
  "improvements": string[],
  "action_items": string[]
}`
          },
        ],
      },
    ],
  });

  const text = response.response.text();

  try {
    return JSON.parse(text || "{}") as AnalysisResult;
  } catch (err) {
    console.error("JSON parse error:", text);
    throw new Error("Invalid JSON response from AI");
  }
};
