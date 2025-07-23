const { MongoClient } = require("mongodb");

// Use the same connection string as the server
const uri =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.6";
const doctorDbName = "medisync_doctors";
const patientDbName = "medisync_patients";

async function checkDatabases() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("🔗 Connected to MongoDB");
    console.log("📍 Doctor Database:", doctorDbName);
    console.log("📍 Patient Database:", patientDbName);

    const doctorDb = client.db(doctorDbName);
    const patientDb = client.db(patientDbName);

    // Check doctor database
    const doctorCollections = await doctorDb.listCollections().toArray();
    console.log(
      "\n📚 Doctor Database Collections:",
      doctorCollections.map((c) => c.name)
    );

    const doctorCollection = doctorDb.collection("doctors");
    const doctorCount = await doctorCollection.countDocuments();
    console.log(`👩‍⚕️ Total doctors: ${doctorCount}`);

    const doctors = await doctorCollection.find({}).toArray();
    if (doctors.length > 0) {
      console.log("\n👩‍⚕️ DOCTORS:");
      doctors.forEach((doctor, index) => {
        console.log(`\n--- Doctor ${index + 1} ---`);
        console.log(`ID: ${doctor._id}`);
        console.log(`Name: Dr. ${doctor.firstName} ${doctor.lastName}`);
        console.log(`Email: ${doctor.email}`);
        console.log(`Specialty: ${doctor.specialty}`);
        console.log(`HPRID: ${doctor.hprid}`);
        console.log(`License: ${doctor.licenseNumber}`);
        console.log(`Registration Date: ${doctor.registrationDate}`);
        console.log(`Verification Status: ${doctor.verificationStatus}`);
      });
    }

    // Check patient database
    const patientCollections = await patientDb.listCollections().toArray();
    console.log(
      "\n📚 Patient Database Collections:",
      patientCollections.map((c) => c.name)
    );

    const patientCollection = patientDb.collection("patients");
    const patientCount = await patientCollection.countDocuments();
    console.log(`🏥 Total patients: ${patientCount}`);

    const patients = await patientCollection.find({}).toArray();
    if (patients.length > 0) {
      console.log("\n🏥 PATIENTS:");
      patients.forEach((patient, index) => {
        console.log(`\n--- Patient ${index + 1} ---`);
        console.log(`ID: ${patient._id}`);
        console.log(`Name: ${patient.firstName} ${patient.lastName}`);
        console.log(`Email: ${patient.email}`);
        console.log(`Blood Type: ${patient.bloodType}`);
        console.log(`Insurance: ${patient.insuranceProvider}`);
        console.log(`Emergency Contact: ${patient.emergencyContactName}`);
        console.log(`Registration Date: ${patient.registrationDate}`);
        console.log(`Status: ${patient.verificationStatus}`);
      });
    }

    // Check HPRID verifications
    const hpridCollection = doctorDb.collection("hprid_verifications");
    const hpridCount = await hpridCollection.countDocuments();
    if (hpridCount > 0) {
      console.log(`\n🆔 HPRID Verifications: ${hpridCount}`);
      const verifications = await hpridCollection.find({}).toArray();
      verifications.forEach((verification, index) => {
        console.log(
          `${index + 1}. HPRID: ${verification.hprid} - Verified: ${
            verification.verified
          }`
        );
      });
    }

    console.log(
      `\n📊 Summary: ${doctorCount} doctors, ${patientCount} patients, ${hpridCount} HPRID verifications`
    );

    if (doctorCount === 0 && patientCount === 0) {
      console.log("\n📝 No profiles found in either database");
      console.log("💡 Try registering a doctor or patient to see data here!");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("\n🔐 Database connections closed");
  }
}

checkDatabases();
