"use server";

/**
 * @fileOverview Geolocation utility using RapidAPI IP Geo Location service
 */

interface GeolocationResponse {
  ip: string;
  country_code: string;
  country_name: string;
  region_name: string;
  city_name: string;
  latitude: number;
  longitude: number;
  zip_code: string;
  time_zone: string;
  asn: string;
  as: string;
  is_proxy: boolean;
}

interface LocationResult {
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
  success: boolean;
  error?: string;
}

/**
 * Get user's location based on their IP address using RapidAPI
 * This provides an approximate location when GPS is not available
 */
export async function getLocationByIP(
  userIP?: string
): Promise<LocationResult> {
  try {
    // Use the provided IP or default to Google's DNS (8.8.8.8) for testing
    const ipAddress = userIP || "8.8.8.8";

    const url = `https://ip-geo-location4.p.rapidapi.com/?ip=${ipAddress}&format=json`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key":
          process.env.RAPIDAPI_KEY ||
          "c92a8ee81cmsh32da64c2c6b94f3p195216jsn262d567bed45",
        "x-rapidapi-host": "ip-geo-location4.p.rapidapi.com",
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GeolocationResponse = await response.json();

    return {
      latitude: result.latitude,
      longitude: result.longitude,
      city: result.city_name,
      region: result.region_name,
      country: result.country_name,
      success: true,
    };
  } catch (error) {
    console.error("Geolocation API error:", error);

    // Return a fallback location (e.g., Mumbai, India) if API fails
    return {
      latitude: 19.076,
      longitude: 72.8777,
      city: "Mumbai",
      region: "Maharashtra",
      country: "India",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get user's location from browser geolocation API
 * This provides precise location when user grants permission
 */
export async function getBrowserLocation(): Promise<LocationResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({
        latitude: 19.076,
        longitude: 72.8777,
        city: "Mumbai",
        region: "Maharashtra",
        country: "India",
        success: false,
        error: "Geolocation not supported",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: "Current Location",
          region: "User Location",
          country: "User Country",
          success: true,
        });
      },
      (error) => {
        console.error("Browser geolocation error:", error);
        resolve({
          latitude: 19.076,
          longitude: 72.8777,
          city: "Mumbai",
          region: "Maharashtra",
          country: "India",
          success: false,
          error: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000, // 10 minutes
      }
    );
  });
}

/**
 * Find nearby healthcare facilities based on coordinates
 * This replaces Google Maps API functionality
 */
export async function findNearbyHealthcareFacilities(
  latitude: number,
  longitude: number
) {
  // Mock healthcare facilities data - in production, this would come from a healthcare database
  const facilities = [
    {
      name: "Apollo Hospital",
      type: "Multi-Specialty Hospital",
      address: "Sarita Vihar, New Delhi",
      phone: "+91-11-2682-5858",
      distance: "2.3 km",
      latitude: latitude + 0.01,
      longitude: longitude + 0.01,
    },
    {
      name: "Max Super Specialty Hospital",
      type: "Super Specialty Hospital",
      address: "Saket, New Delhi",
      phone: "+91-11-2651-5050",
      distance: "3.1 km",
      latitude: latitude - 0.01,
      longitude: longitude + 0.015,
    },
    {
      name: "Fortis Hospital",
      type: "Multi-Specialty Hospital",
      address: "Shalimar Bagh, New Delhi",
      phone: "+91-11-4277-6222",
      distance: "4.2 km",
      latitude: latitude + 0.02,
      longitude: longitude - 0.01,
    },
    {
      name: "AIIMS (All India Institute of Medical Sciences)",
      type: "Government Hospital",
      address: "Ansari Nagar, New Delhi",
      phone: "+91-11-2658-8500",
      distance: "5.1 km",
      latitude: latitude - 0.02,
      longitude: longitude - 0.015,
    },
    {
      name: "Medanta - The Medicity",
      type: "Multi-Specialty Hospital",
      address: "Sector 38, Gurugram",
      phone: "+91-124-414-1414",
      distance: "6.8 km",
      latitude: latitude + 0.03,
      longitude: longitude + 0.02,
    },
  ];

  return facilities.map((facility) => ({
    ...facility,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      facility.name + " " + facility.address
    )}`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`,
  }));
}
