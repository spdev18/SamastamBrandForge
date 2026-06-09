import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, industry, description, brandColors, tagline } = body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    // Use gemini-2.0-flash-preview-image-generation for image output
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-preview-image-generation",
    } as Parameters<typeof genAI.getGenerativeModel>[0]);

    const prompt = `Create a professional, modern logo for a business called "${businessName}" in the ${industry} industry.
Business description: ${description}
Brand colors: ${brandColors || "choose appropriate colors"}
Tagline: ${tagline || ""}

Design requirements:
- Clean, minimalist, and memorable logo
- Vector-style flat design
- Professional and suitable for ${industry} industry
- Include the business name in stylized text
- Make it versatile for both light and dark backgrounds
- High contrast and visually striking`;

    const result = await (model as unknown as {
      generateContent: (params: {
        contents: { role: string; parts: { text: string }[] }[];
        generationConfig: { responseModalities: string[] };
      }) => Promise<{ response: { candidates?: { content: { parts: { inlineData?: { mimeType: string; data: string } }[] } }[] } }>;
    }).generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
    });

    const response = result.response;
    const candidates = response.candidates;

    if (!candidates || candidates.length === 0) {
      return NextResponse.json({ error: "No image generated" }, { status: 500 });
    }

    const parts = candidates[0].content.parts;
    const imagePart = parts.find((p) => p.inlineData);

    if (!imagePart?.inlineData) {
      return NextResponse.json({ error: "No image data in response" }, { status: 500 });
    }

    return NextResponse.json({
      imageData: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
      prompt,
    });
  } catch (error) {
    console.error("Logo generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate logo" },
      { status: 500 }
    );
  }
}
