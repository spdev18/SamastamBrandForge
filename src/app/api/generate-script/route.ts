import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, industry, description, targetAudience, tagline } = body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a professional scriptwriter for marketing video ads.

Write a compelling 30-second video script for a female anchor/presenter to deliver for this business:

Business: ${businessName}
Industry: ${industry}
Description: ${description}
Target Audience: ${targetAudience || "general audience"}
Tagline: ${tagline || ""}

Requirements:
- 30 seconds when spoken at natural pace (~75-80 words)
- Conversational, engaging, and professional tone
- Start with a hook that grabs attention immediately
- Mention the business name and key benefit
- End with a clear call-to-action
- Written specifically for a female anchor to deliver naturally
- No stage directions, just the spoken words

Return ONLY the script text, nothing else.`;

    const result = await model.generateContent(prompt);
    const script = result.response.text().trim();

    return NextResponse.json({ script });
  } catch (error) {
    console.error("Script generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate script" },
      { status: 500 }
    );
  }
}
