import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=squarish`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ results: data.results });
  } catch (error) {
    console.error("Unsplash API error:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
} 