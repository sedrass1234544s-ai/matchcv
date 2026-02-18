import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeCV = async (imageData: string, mimeType: string): Promise<AnalysisResult> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const response = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: imageData.split(",")[1],
      },
    },
    {
      text: `Analyze this CV/Resume. Evaluate it based on modern HR standards.
      Provide feedback in JSON format including:
      1. A score from 0-100.
      2. List of strengths.
      3. List of weaknesses.
      4. Specific feedback on the professional photo (if present).
      5. Improvements for the content.
      6. Suggested immediate action items.
      Focus on layout, clarity, keyword optimization, and professional impact.`,
    },
  ]);

  const text = response.response.text();
  return JSON.parse(text || "{}") as AnalysisResult;
};
