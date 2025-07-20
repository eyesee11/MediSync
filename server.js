const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// MongoDB connection URI
const uri =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.6";
const doctorDbName = "medisync_doctors"; // Separate database for doctors
const patientDbName = "medisync_patients"; // Separate database for patients

let doctorDb;
let patientDb;

async function connectToDatabase() {
  const client = new MongoClient(uri);
  await client.connect();
  doctorDb = client.db(doctorDbName);
  patientDb = client.db(patientDbName);
  console.log("Connected to MongoDB");
  console.log(`Doctor Database: ${doctorDbName}`);
  console.log(`Patient Database: ${patientDbName}`);
}

connectToDatabase().catch(console.error);

app.use(bodyParser.json());

// API endpoint to handle data input (legacy endpoint)
app.post("/api/data", async (req, res) => {
  try {
    // This is a legacy endpoint - you can remove this if not needed
    const collection = doctorDb.collection("userData"); // Using doctor DB for legacy data
    const result = await collection.insertOne(req.body);
    res
      .status(201)
      .json({ message: "Data inserted successfully", id: result.insertedId });
  } catch (error) {
    console.error("Error inserting data:", error);
    res
      .status(500)
      .json({ message: "Error inserting data", error: error.message });
  }
});

// API endpoint to handle doctor profile registration
app.post("/api/doctors/register", async (req, res) => {
  try {
    console.log("=== Doctor Registration Request ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Database:", doctorDbName);
    console.log("Database object:", !!doctorDb);
    console.log("Database state:", doctorDb ? "connected" : "not connected");

    if (!doctorDb) {
      throw new Error("Doctor database not connected");
    }

    const collection = doctorDb.collection("doctors"); // Store in doctors collection
    console.log("Collection object:", !!collection);

    const doctorData = {
      ...req.body,
      profileType: "doctor", // Added to distinguish doctor profiles
      registrationDate: new Date(),
      verificationStatus: "pending",
      approvalStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Data to insert:", JSON.stringify(doctorData, null, 2));

    const result = await collection.insertOne(doctorData);
    console.log("Insert result:", result);
    console.log("Doctor profile inserted with ID:", result.insertedId);
    console.log("Acknowledged:", result.acknowledged);

    // Verify the insertion
    const verifyCount = await collection.countDocuments();
    console.log("Total documents in collection after insert:", verifyCount);

    res.status(201).json({
      message: "Doctor registration submitted successfully",
      id: result.insertedId,
      status: "pending_review",
      acknowledged: result.acknowledged,
      totalProfiles: verifyCount,
    });
  } catch (error) {
    console.error("Error registering doctor:", error);
    console.error("Stack trace:", error.stack);
    res
      .status(500)
      .json({ message: "Error registering doctor", error: error.message });
  }
});

// API endpoint to handle patient profile registration
app.post("/api/patients/register", async (req, res) => {
  try {
    console.log("=== Patient Registration Request ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Database:", patientDbName);
    console.log("Database object:", !!patientDb);
    console.log("Database state:", patientDb ? "connected" : "not connected");

    if (!patientDb) {
      throw new Error("Patient database not connected");
    }

    const collection = patientDb.collection("patients"); // Store in patients collection
    console.log("Collection object:", !!collection);

    const patientData = {
      ...req.body,
      profileType: "patient", // Distinguish patient profiles
      registrationDate: new Date(),
      verificationStatus: "verified", // Patients don't need HPRID verification
      approvalStatus: "approved", // Patients are auto-approved
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Data to insert:", JSON.stringify(patientData, null, 2));

    const result = await collection.insertOne(patientData);
    console.log("Insert result:", result);
    console.log("Patient profile inserted with ID:", result.insertedId);
    console.log("Acknowledged:", result.acknowledged);

    // Verify the insertion
    const verifyCount = await collection.countDocuments();
    console.log("Total documents in collection after insert:", verifyCount);

    res.status(201).json({
      message: "Patient registration submitted successfully",
      id: result.insertedId,
      status: "approved",
      acknowledged: result.acknowledged,
      totalProfiles: verifyCount,
    });
  } catch (error) {
    console.error("Error registering patient:", error);
    console.error("Stack trace:", error.stack);
    res
      .status(500)
      .json({ message: "Error registering patient", error: error.message });
  }
});

// API endpoint to verify HPRID
app.post("/api/doctors/verify-hprid", async (req, res) => {
  try {
    const { hprid } = req.body;

    if (!hprid) {
      return res.status(400).json({ message: "HPRID is required" });
    }

    // Mock HPRID verification logic
    // In a real implementation, this would call the actual HPRID verification API
    const isValid =
      hprid.length >= 10 && /^[A-Z0-9]+$/.test(hprid.toUpperCase());

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (isValid) {
      // Store verification result in doctor database
      const collection = doctorDb.collection("hprid_verifications");
      await collection.insertOne({
        profileType: "hprid_verification",
        hprid: hprid.toUpperCase(),
        verified: true,
        verificationDate: new Date(),
        status: "active",
        createdAt: new Date(),
      });

      console.log("HPRID verification stored:", hprid.toUpperCase());

      res.status(200).json({
        verified: true,
        message: "HPRID verified successfully",
        hprid: hprid.toUpperCase(),
      });
    } else {
      res.status(400).json({
        verified: false,
        message: "Invalid HPRID format or number",
      });
    }
  } catch (error) {
    console.error("Error verifying HPRID:", error);
    res
      .status(500)
      .json({ message: "Error verifying HPRID", error: error.message });
  }
});

// API endpoint to get doctor profile
app.get("/api/doctors/:id", async (req, res) => {
  try {
    const collection = doctorDb.collection("doctors"); // Use doctor database
    const doctor = await collection.findOne({
      _id: req.params.id,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res
      .status(500)
      .json({ message: "Error fetching doctor", error: error.message });
  }
});

// API endpoint to get all doctor profiles (for testing)
app.get("/api/doctors", async (req, res) => {
  try {
    const collection = doctorDb.collection("doctors");
    const doctors = await collection.find({}).toArray();
    res.status(200).json({
      database: doctorDbName,
      collection: "doctors",
      count: doctors.length,
      doctors: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res
      .status(500)
      .json({ message: "Error fetching doctors", error: error.message });
  }
});

// API endpoint to get all patient profiles (for testing)
app.get("/api/patients", async (req, res) => {
  try {
    const collection = patientDb.collection("patients");
    const patients = await collection.find({}).toArray();
    res.status(200).json({
      database: patientDbName,
      collection: "patients",
      count: patients.length,
      patients: patients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
});

// API endpoint to get patient profile
app.get("/api/patients/:id", async (req, res) => {
  try {
    const collection = patientDb.collection("patients");
    const patient = await collection.findOne({
      _id: req.params.id,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error);
    res
      .status(500)
      .json({ message: "Error fetching patient", error: error.message });
  }
});

// API endpoint to get all profiles (for testing and monitoring)
app.get("/api/profiles", async (req, res) => {
  try {
    const doctorCollection = doctorDb.collection("doctors");
    const patientCollection = patientDb.collection("patients");

    const doctors = await doctorCollection.find({}).toArray();
    const patients = await patientCollection.find({}).toArray();

    res.status(200).json({
      doctorDatabase: doctorDbName,
      patientDatabase: patientDbName,
      doctorCount: doctors.length,
      patientCount: patients.length,
      totalCount: doctors.length + patients.length,
      doctors: doctors,
      patients: patients,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res
      .status(500)
      .json({ message: "Error fetching profiles", error: error.message });
  }
});

// API endpoint to check database connection
app.get("/api/health", async (req, res) => {
  try {
    const doctorAdminDb = doctorDb.admin();
    const patientAdminDb = patientDb.admin();
    const doctorStatus = await doctorAdminDb.ping();
    const patientStatus = await patientAdminDb.ping();
    res.status(200).json({
      status: "connected",
      doctorDatabase: doctorDbName,
      patientDatabase: patientDbName,
      timestamp: new Date(),
      doctorPing: doctorStatus,
      patientPing: patientStatus,
    });
  } catch (error) {
    res.status(500).json({
      status: "disconnected",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  console.log(`Doctor Database: ${doctorDbName}`);
  console.log(`Patient Database: ${patientDbName}`);
  console.log(`API endpoints:`);
  console.log(`  - POST /api/doctors/register - Register doctor profile`);
  console.log(`  - POST /api/patients/register - Register patient profile`);
  console.log(`  - POST /api/doctors/verify-hprid - Verify HPRID`);
  console.log(`  - GET /api/doctors - Get all doctor profiles`);
  console.log(`  - GET /api/patients - Get all patient profiles`);
  console.log(`  - GET /api/profiles - Get all profiles from both databases`);
  console.log(`  - GET /api/health - Check database connections`);
});
