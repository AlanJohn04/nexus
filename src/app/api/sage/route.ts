import { NextResponse } from 'next/server';

const GEMINI_API_KEY = "AIzaSyDBXVlk0A9NtEOH6VLKm3unpZOy2KpadpI"; // HARDCODED FOR NOW, move to .env.local

export async function POST(request: Request) {
  try {
    const { text, category, deadlineDays } = await request.json();

    if (!text || !category || !deadlineDays) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `You are SAGE (Strategic Alignment and Growth Engine). 
Analyze the following user intention and return a strictly formatted JSON object (without markdown or backticks).

Intention: "${text}"
Category: ${category}
Deadline: ${deadlineDays} days

You must calculate the probability of success, suggest an optimal deadline offset (in days, e.g. -2 or +5, or 0 if perfect), identify 2 risk factors, identify 2 opportunities, and suggest a better formulated version of the intention.

The response MUST be valid JSON with this exact structure:
{
  "probability": number, // an integer between 15 and 95
  "optimalDeadlineOffsetDays": number, // integer
  "risks": ["risk 1", "risk 2"], // string array of risks
  "opportunities": ["opportunity 1", "opportunity 2"], // string array of opportunities
  "suggestedText": "string" // the improved intention
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 });
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json({ error: "No text generated" }, { status: 500 });
    }

    const analysis = JSON.parse(generatedText);
    return NextResponse.json(analysis);

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
