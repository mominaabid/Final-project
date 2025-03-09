import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    console.error("API Error: City parameter is required");
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 });
  }

  const SERP_API_KEY = ;
  const url = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(
    `${city} iconic view`
  )}&location=${encodeURIComponent(city)}&api_key=${SERP_API_KEY}`;

  try {
    console.log(`API Request: Fetching image from SerpAPI for ${city} at ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: SerpAPI request failed with status ${response.status} - ${errorText}`);
      throw new Error(`SerpAPI request failed with status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response from SerpAPI:", JSON.stringify(data, null, 2));

    const imageUrl = data.images_results?.[0]?.original || null;
    if (!imageUrl) {
      console.warn(`API Warning: No images found for ${city}`);
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("API Error in /api/get-city-image:", error.message);
    return NextResponse.json({ imageUrl: null, error: error.message }, { status: 500 });
  }
}