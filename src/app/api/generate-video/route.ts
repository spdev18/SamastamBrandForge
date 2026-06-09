import { NextRequest, NextResponse } from "next/server";

// HeyGen API integration for AI anchor video generation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { script } = body;

    if (!script) {
      return NextResponse.json({ error: "Script is required" }, { status: 400 });
    }

    const apiKey = process.env.HEYGEN_API_KEY;

    if (!apiKey || apiKey === "your_heygen_api_key_here") {
      // Return demo response when no API key is configured
      return NextResponse.json({
        videoId: null,
        status: "no_api_key",
        message: "HeyGen API key not configured. Video generation requires a HeyGen API key.",
        demoMode: true,
      });
    }

    // Create HeyGen video with female avatar
    const createRes = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: {
              type: "avatar",
              // Noelle is a professional female avatar in HeyGen
              avatar_id: "Noelle_Front_Public",
              avatar_style: "normal",
            },
            voice: {
              type: "text",
              input_text: script,
              voice_id: "1bd001e7e50f421d891986aad5158bc8", // Female English voice
              speed: 1.0,
            },
            background: {
              type: "color",
              value: "#1a1a2e",
            },
          },
        ],
        dimension: { width: 1280, height: 720 },
        aspect_ratio: "16:9",
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      return NextResponse.json({ error: `HeyGen error: ${err}` }, { status: 500 });
    }

    const createData = await createRes.json();
    const videoId = createData.data?.video_id;

    if (!videoId) {
      return NextResponse.json({ error: "No video ID returned from HeyGen" }, { status: 500 });
    }

    return NextResponse.json({ videoId, status: "processing" });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate video" },
      { status: 500 }
    );
  }
}
