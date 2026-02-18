
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });


export const analyzeCV = async (imageData: string, mimeType: string): Promise<AnalysisResult> => {
  const model = 'gemini-3-pro-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: imageData.split(',')[1],
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
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          photoFeedback: { type: Type.STRING },
          contentImprovements: { type: Type.STRING },
          suggestedActionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["score", "strengths", "weaknesses", "photoFeedback", "contentImprovements", "suggestedActionItems"],
      },
    },
  });

  return JSON.parse(response.text || '{}') as AnalysisResult;
};
