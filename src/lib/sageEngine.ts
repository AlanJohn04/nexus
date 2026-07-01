import { IntentCategory } from './types';

export interface SageAnalysis {
  probability: number;
  optimalDeadlineOffsetDays: number;
  risks: string[];
  opportunities: string[];
  suggestedText: string;
}

export async function analyzeIntention(
  text: string,
  category: IntentCategory,
  deadlineDays: number
): Promise<SageAnalysis> {
  try {
    const response = await fetch('/api/sage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, category, deadlineDays }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch SAGE analysis");
    }

    const data: SageAnalysis = await response.json();
    return data;
  } catch (error) {
    console.error("SAGE Analysis Error:", error);
    // Fallback in case the API fails
    return {
      probability: 50,
      optimalDeadlineOffsetDays: 0,
      risks: ["API connection failed. Using fallback analysis."],
      opportunities: ["Try again later for a full AI analysis."],
      suggestedText: text,
    };
  }
}
