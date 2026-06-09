import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessName, industry, description, brandColors, targetAudience, tagline, platform } = body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-preview-image-generation",
    } as Parameters<typeof genAI.getGenerativeModel>[0]);

    const platformDimensions: Record<string, string> = {
      instagram: "square 1:1 ratio",
      facebook: "landscape 1.91:1 ratio",
      twitter: "landscape 16:9 ratio",
      linkedin: "landscape 1.91:1 ratio",
      story: "portrait 9:16 ratio",
    };

    const prompt = `Create a stunning, professional social media marketing poster for "${businessName}" in the ${industry} industry.

Platform: ${platform || "Instagram"} - ${platformDimensions[platform] || "square format"}
Target Audience: ${targetAudience || "general audience"}
Brand Colors: ${brandColors || "use vibrant professional colors"}
Tagline: ${tagline || ""}
Business Description: ${description}

Design requirements:
- Eye-catching and scroll-stopping design
- Bold typography with business name prominently displayed
- Include tagline or call-to-action text
- Professional layout with clear visual hierarchy
- Vibrant but brand-appropriate color scheme
- Modern gradient or pattern background
- High-quality marketing poster aesthetic
- Include decorative elements, icons, or illustrations relevant to ${industry}
- Make it look like a premium brand campaign poster`;

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
    console.error("Poster generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate poster" },
      { status: 500 }
    );
  }
}
