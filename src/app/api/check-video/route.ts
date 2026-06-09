import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json({ error: "videoId required" }, { status: 400 });
    }

    const apiKey = process.env.HEYGEN_API_KEY;
    if (!apiKey || apiKey === "your_heygen_api_key_here") {
      return NextResponse.json({ status: "no_api_key" });
    }

    const res = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
      headers: { "X-Api-Key": apiKey },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to check video status" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({
      status: data.data?.status,
      videoUrl: data.data?.video_url,
      thumbnailUrl: data.data?.thumbnail_url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to check video" },
      { status: 500 }
    );
  }
}
