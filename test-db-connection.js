// Quick test script to verify database connectivity and API endpoints
const { MongoClient } = require("mongodb");

async function testDatabaseConnection() {
  const uri =
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.6";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB");

    const db = client.db("testing");
    const collection = db.collection("profiles");

    // Check if collection exists and get current documents
    const count = await collection.countDocuments();
    console.log(`📊 Current profiles count: ${count}`);

    if (count > 0) {
      const profiles = await collection.find({}).limit(5).toArray();
      console.log("📋 Sample profiles:");
      profiles.forEach((profile, index) => {
        console.log(
          `   ${index + 1}. Type: ${
            profile.profileType || "unknown"
          }, Created: ${profile.createdAt || "unknown"}`
        );
      });
    }

    // Test inserting a sample profile
    const testProfile = {
      profileType: "test",
      testData: "This is a test profile",
      createdAt: new Date(),
      timestamp: Date.now(),
    };

    const result = await collection.insertOne(testProfile);
    console.log(`✅ Test profile inserted with ID: ${result.insertedId}`);

    // Clean up test profile
    await collection.deleteOne({ _id: result.insertedId });
    console.log("🧹 Test profile cleaned up");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  } finally {
    await client.close();
    console.log("🔌 Database connection closed");
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  const fetch = (await import("node-fetch")).default;
  const baseUrl = "http://localhost:3000";

  console.log("\n🔍 Testing API endpoints...");

  try {
    // Test health endpoint
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Health endpoint working:", healthData.status);
    } else {
      console.log("❌ Health endpoint failed:", healthResponse.status);
    }

    // Test profiles endpoint
    const profilesResponse = await fetch(`${baseUrl}/api/profiles`);
    if (profilesResponse.ok) {
      const profilesData = await profilesResponse.json();
      console.log(
        `✅ Profiles endpoint working. Found ${profilesData.count} profiles`
      );
    } else {
      console.log("❌ Profiles endpoint failed:", profilesResponse.status);
    }
  } catch (error) {
    console.error("❌ API test error:", error.message);
  }
}

async function runTests() {
  console.log("🚀 Starting database and API tests...\n");

  await testDatabaseConnection();
  await testAPIEndpoints();

  console.log("\n✨ Tests completed!");
}

runTests().catch(console.error);
