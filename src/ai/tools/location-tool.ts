"use server";
/**
 * @fileOverview A Genkit tool for retrieving the user's location using RapidAPI.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
import {
  getLocationByIP,
  findNearbyHealthcareFacilities,
} from "@/lib/geolocation";

export const getLocationTool = ai.defineTool(
  {
    name: "getUserLocation",
    description:
      "Gets the user's current physical location using IP geolocation and finds nearby healthcare facilities.",
    inputSchema: z.object({
      userIP: z
        .string()
        .optional()
        .describe("The user IP address for geolocation lookup"),
    }),
    outputSchema: z.object({
      latitude: z.number().describe("The latitude of the user."),
      longitude: z.number().describe("The longitude of the user."),
      city: z.string().describe("The city name of the user."),
      region: z.string().describe("The region/state of the user."),
      country: z.string().describe("The country of the user."),
      nearbyFacilities: z
        .array(
          z.object({
            name: z.string(),
            type: z.string(),
            address: z.string(),
            phone: z.string(),
            distance: z.string(),
            googleMapsUrl: z.string(),
            directionsUrl: z.string(),
          })
        )
        .describe("List of nearby healthcare facilities"),
      success: z
        .boolean()
        .describe("Whether the location was successfully retrieved"),
      error: z
        .string()
        .optional()
        .describe("Error message if location retrieval failed"),
    }),
  },
  async (input) => {
    try {
      console.log("Getting user location using RapidAPI IP geolocation...");

      const locationResult = await getLocationByIP(input.userIP);

      // Find nearby healthcare facilities
      const nearbyFacilities = await findNearbyHealthcareFacilities(
        locationResult.latitude,
        locationResult.longitude
      );

      return {
        latitude: locationResult.latitude,
        longitude: locationResult.longitude,
        city: locationResult.city,
        region: locationResult.region,
        country: locationResult.country,
        nearbyFacilities,
        success: locationResult.success,
        error: locationResult.error,
      };
    } catch (error) {
      console.error("Location tool error:", error);

      // Return fallback Mumbai location with nearby facilities
      const fallbackLat = 19.076;
      const fallbackLon = 72.8777;
      const nearbyFacilities = await findNearbyHealthcareFacilities(
        fallbackLat,
        fallbackLon
      );

      return {
        latitude: fallbackLat,
        longitude: fallbackLon,
        city: "Mumbai",
        region: "Maharashtra",
        country: "India",
        nearbyFacilities,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Location service unavailable",
      };
    }
  }
);
