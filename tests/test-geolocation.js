// Test script for the new RapidAPI geolocation service
const {
  getLocationByIP,
  findNearbyHealthcareFacilities,
} = require("./src/lib/geolocation.ts");

async function testGeolocation() {
  console.log("Testing RapidAPI geolocation service...\n");

  try {
    // Test with Google's DNS IP
    const result = await getLocationByIP("8.8.8.8");
    console.log("Location Result:", result);

    if (result.success) {
      console.log("\n✅ Location retrieved successfully!");
      console.log(
        `📍 Location: ${result.city}, ${result.region}, ${result.country}`
      );
      console.log(`🌐 Coordinates: ${result.latitude}, ${result.longitude}`);

      // Test nearby facilities
      const facilities = await findNearbyHealthcareFacilities(
        result.latitude,
        result.longitude
      );
      console.log("\n🏥 Nearby Healthcare Facilities:");
      facilities.forEach((facility, index) => {
        console.log(`${index + 1}. ${facility.name}`);
        console.log(`   Type: ${facility.type}`);
        console.log(`   Distance: ${facility.distance}`);
        console.log(`   Maps: ${facility.googleMapsUrl}`);
        console.log("");
      });
    } else {
      console.log("❌ Location service failed, using fallback");
      console.log("Error:", result.error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testGeolocation();
