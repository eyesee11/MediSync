import { NextRequest, NextResponse } from "next/server";
import { getLocationByIP } from "@/lib/geolocation";

export async function GET(request: NextRequest) {
  try {
    // Get the user's IP address from the request headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIP = request.headers.get("x-real-ip");
    const clientIP = forwarded?.split(",")[0] || realIP || "8.8.8.8";

    console.log("Client IP:", clientIP);

    // Get location using RapidAPI
    const locationResult = await getLocationByIP(clientIP);

    return NextResponse.json({
      ...locationResult,
      ip: clientIP,
    });
  } catch (error) {
    console.error("Location API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get location",
        // Fallback to Mumbai coordinates
        latitude: 19.076,
        longitude: 72.8777,
        city: "Mumbai",
        region: "Maharashtra",
        country: "India",
      },
      { status: 500 }
    );
  }
}
