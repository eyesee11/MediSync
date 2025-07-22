
const { MongoClient } = require("mongodb");

// Use the same connection string as the server
const uri =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.6";
const dbName = "testing";

async function checkDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("🔗 Connected to MongoDB");
    console.log("📍 Using database:", dbName);

    const db = client.db(dbName);
    const collection = db.collection("profiles");

    // List all collections in the database
    const collections = await db.listCollections().toArray();
    console.log(
      "📚 Available collections:",
      collections.map((c) => c.name)
    );

    // Count total documents
    const count = await collection.countDocuments();
    console.log(`📊 Total profiles in collection: ${count}`);

    // Get all documents
    const profiles = await collection.find({}).toArray();

    if (profiles.length > 0) {
      console.log("\n📋 All profiles:");

      // Separate doctors and patients
      const doctors = profiles.filter((p) => p.profileType === "doctor");
      const patients = profiles.filter((p) => p.profileType === "patient");

      if (doctors.length > 0) {
        console.log("\n👩‍⚕️ DOCTORS:");
        doctors.forEach((profile, index) => {
          console.log(`\n--- Doctor ${index + 1} ---`);
          console.log(`ID: ${profile._id}`);
          console.log(`Name: Dr. ${profile.firstName} ${profile.lastName}`);
          console.log(`Email: ${profile.email}`);
          console.log(`Specialty: ${profile.specialty}`);
          console.log(`HPRID: ${profile.hprid}`);
          console.log(`License: ${profile.licenseNumber}`);
          console.log(`Registration Date: ${profile.registrationDate}`);
          console.log(`Verification Status: ${profile.verificationStatus}`);
        });
      }

      if (patients.length > 0) {
        console.log("\n🏥 PATIENTS:");
        patients.forEach((profile, index) => {
          console.log(`\n--- Patient ${index + 1} ---`);
          console.log(`ID: ${profile._id}`);
          console.log(`Name: ${profile.firstName} ${profile.lastName}`);
          console.log(`Email: ${profile.email}`);
          console.log(`Blood Type: ${profile.bloodType}`);
          console.log(`Insurance: ${profile.insuranceProvider}`);
          console.log(`Emergency Contact: ${profile.emergencyContactName}`);
          console.log(`Registration Date: ${profile.registrationDate}`);
          console.log(`Status: ${profile.verificationStatus}`);
        });
      }

      console.log(
        `\n📊 Summary: ${doctors.length} doctors, ${patients.length} patients`
      );
    } else {
      console.log("\n📝 No profiles found in the collection");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("\n🔐 Database connection closed");
  }
}

checkDatabase();
