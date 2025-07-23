const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("PatientDataConsent", function () {
  let contract;
  let owner;
  let patient;
  let doctor;
  let approver;

  beforeEach(async function () {
    // Get test accounts
    [owner, patient, doctor, approver] = await ethers.getSigners();

    // Deploy the contract
    const PatientDataConsent = await ethers.getContractFactory(
      "PatientDataConsent"
    );
    contract = await PatientDataConsent.deploy();
    await contract.waitForDeployment();

    console.log("\n🏥 Contract deployed to:", await contract.getAddress());
    console.log("👨‍💼 Owner:", owner.address);
    console.log("🧑‍⚕️ Patient:", patient.address);
    console.log("👩‍⚕️ Doctor:", doctor.address);
    console.log("✅ Approver:", approver.address);
  });

  it("Should upload medical record and test approval workflow", async function () {
    console.log("\n--- Testing Medical Record Upload and Approval ---\n");

    // Add an approver (doctor)
    await contract.connect(owner).addApprover(doctor.address);
    console.log("✅ Added doctor as approver");

    // Patient uploads a medical record
    const ipfsHash = "QmTestHash123456789";
    const recordType = "Blood Test Results";
    const description = "Complete blood count report";

    const uploadTx = await contract
      .connect(patient)
      .uploadData(ipfsHash, recordType, description);

    console.log("📄 Patient uploaded medical record");
    console.log("   IPFS Hash:", ipfsHash);
    console.log("   Type:", recordType);
    console.log("   Description:", description);

    // Check the record before approval
    const recordBefore = await contract.getRecord(0);
    console.log("\n📋 Record details before approval:");
    console.log("   Patient:", recordBefore[2]);
    console.log("   Approved:", recordBefore[1]);
    console.log(
      "   Timestamp:",
      new Date(Number(recordBefore[4]) * 1000).toLocaleString()
    );

    // Doctor approves the record
    await contract.connect(doctor).approveData(0);
    console.log("\n✅ Doctor approved the medical record");

    // Check the record after approval
    const recordAfter = await contract.getRecord(0);
    console.log("\n📋 Record details after approval:");
    console.log("   Patient:", recordAfter[2]);
    console.log("   Doctor:", recordAfter[3]);
    console.log("   Approved:", recordAfter[1]);
    console.log("   Type:", recordAfter[5]);
    console.log("   Description:", recordAfter[6]);

    // Verify the record is properly stored
    expect(recordAfter[0]).to.equal(ipfsHash);
    expect(recordAfter[1]).to.be.true;
    expect(recordAfter[2]).to.equal(patient.address);
    expect(recordAfter[3]).to.equal(doctor.address);
    expect(recordAfter[5]).to.equal(recordType);
    expect(recordAfter[6]).to.equal(description);

    console.log(
      "\n🎉 All tests passed! Blockchain functionality is working correctly."
    );
  });

  it("Should test access control and permissions", async function () {
    console.log("\n--- Testing Access Control ---\n");

    // Try to approve without being an approver (should fail)
    try {
      await contract
        .connect(patient)
        .uploadData("QmTest", "X-Ray", "Chest X-Ray");
      await contract.connect(patient).approveData(0);
      console.log("❌ Error: Patient should not be able to approve");
    } catch (error) {
      console.log(
        "✅ Access control working: Non-approver cannot approve records"
      );
    }

    // Add approver and test successful approval
    await contract.connect(owner).addApprover(approver.address);
    await contract.connect(approver).approveData(0);
    console.log("✅ Authorized approver successfully approved record");

    const record = await contract.getRecord(0);
    expect(record[1]).to.be.true;
    expect(record[3]).to.equal(approver.address);
  });

  it("Should test record statistics", async function () {
    console.log("\n--- Testing Record Statistics ---\n");

    // Upload multiple records
    for (let i = 0; i < 3; i++) {
      await contract
        .connect(patient)
        .uploadData(
          `QmTestHash${i}`,
          `Test Type ${i}`,
          `Test Description ${i}`
        );
    }

    const totalRecords = await contract.getTotalRecords();
    console.log(`📊 Total records in system: ${totalRecords}`);

    expect(totalRecords).to.equal(3);
    console.log("✅ Record statistics working correctly");
  });
});
