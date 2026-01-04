import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedDiagramData } from '../types';

const apiKey = process.env.API_KEY || '';
// Initialize client safely
const ai = new GoogleGenAI({ apiKey });

export const generateDiagramFromPrompt = async (prompt: string): Promise<GeneratedDiagramData> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: `Create a diagram/flowchart for: "${prompt}".
      
      You MUST return the response in a structured JSON format suitable for a node-based diagramming tool.
      The layout should be logical (e.g., a top-down or left-to-right flow).
      
      Calculate rough X and Y coordinates. Assume a canvas where 0,0 is top left.
      Standard node width is 150px, height is 50px. Space them out by at least 100px vertical or horizontal.
      
      Return strict JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, description: "One of: input, default, output" },
                  label: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["id", "type", "label", "x", "y"]
              }
            },
            edges: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  source: { type: Type.STRING },
                  target: { type: Type.STRING },
                  label: { type: Type.STRING }
                },
                required: ["id", "source", "target"]
              }
            }
          },
          required: ["nodes", "edges"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GeneratedDiagramData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
