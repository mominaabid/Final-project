export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return new Response(JSON.stringify({ error: "No city provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const UNSPLASH_API_KEY = ""; // Replace with your actual Unsplash Access Key
  const controller = new AbortController();

  // Simple relevance check function
  const checkImageRelevance = (result, location) => {
    const description = (result.description || result.alt_description || "").toLowerCase();
    const tags = result.tags ? result.tags.map(tag => tag.title.toLowerCase()) : [];
    const locationLower = location.toLowerCase();
    return description.includes(locationLower) || tags.some(tag => tag.includes(locationLower));
  };

  try {
    const simplifiedLocation = city.split(",")[0].trim();
    console.log(`Fetching images for: ${simplifiedLocation}`);

    let bgImage = "/mountains.jpg";

    // Primary search for famous landmarks
    const bgResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        `${simplifiedLocation} famous landmark building historical site`
      )}&per_page=1&orientation=landscape&client_id=${UNSPLASH_API_KEY}`,
      { signal: controller.signal }
    );

    if (!bgResponse.ok) {
      console.error(`Unsplash primary fetch failed: ${bgResponse.status} - ${await bgResponse.text()}`);
      // Instead of throwing, proceed to fallback
    } else {
      const bgData = await bgResponse.json();
      if (bgData.results && bgData.results.length > 0) {
        const result = bgData.results[0];
        if (checkImageRelevance(result, simplifiedLocation)) {
          bgImage = result.urls.regular;
        }
      }
    }

    // Fallback search if no relevant image found
    if (bgImage === "/mountains.jpg") {
      const fallbackResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          simplifiedLocation
        )}&per_page=1&orientation=landscape&client_id=${UNSPLASH_API_KEY}`,
        { signal: controller.signal }
      );

      if (!fallbackResponse.ok) {
        console.error(`Unsplash fallback fetch failed: ${fallbackResponse.status} - ${await fallbackResponse.text()}`);
      } else {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.results && fallbackData.results.length > 0) {
          bgImage = fallbackData.results[0].urls.regular;
        }
      }
    }

    return new Response(JSON.stringify({ imageUrl: bgImage }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in getCityImage API:", error);
    return new Response(JSON.stringify({ imageUrl: "/mountains.jpg", error: "Failed to fetch image", details: error.message }), {
      status: 200, // Return 200 with fallback instead of 500
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    controller.abort();
  }
}