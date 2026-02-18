import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeCV = async (imageData: string, mimeType: string): Promise<AnalysisResult> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

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
            text: `Analyze this CV/Resume. Provide a JSON response including:
            - score (0-100)
            - strengths
            - weaknesses
            - photo feedback
            - improvements
            - action items`,
          },
        ],
      },
    ],
  });

  const text = response.response.text();
  return JSON.parse(text || "{}") as AnalysisResult;
};
