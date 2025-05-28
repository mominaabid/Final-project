import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { size } = params; // e.g., "300/200"
  const [width, height] = size.split("/").map(Number);

  // Validate size parameters
  if (!width || !height || width <= 0 || height <= 0) {
    return NextResponse.json({ error: "Invalid size parameters" }, { status: 400 });
  }

  // For simplicity, redirect to a valid placeholder service (e.g., via.placeholder.com)
  // Alternatively, you can serve a local image or generate one using a library like sharp
  const placeholderUrl = `https://via.placeholder.com/${width}x${height}?text=Placeholder+Image`;
  return NextResponse.redirect(placeholderUrl);
}