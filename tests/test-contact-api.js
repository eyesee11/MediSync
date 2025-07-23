// Test file to verify email functionality
// Run: node test-contact-api.js

const testContactAPI = async () => {
  try {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      subject: "Test Contact Form",
      message:
        "This is a test message to verify the contact form functionality.",
    };

    console.log("Testing contact API...");
    console.log("Sending test data:", testData);

    const response = await fetch("http://localhost:3001/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", result);

    if (response.ok && result.success) {
      console.log("✅ Contact API test successful!");
      console.log("Message:", result.message);
    } else {
      console.log("❌ Contact API test failed!");
      console.log("Error:", result.error);
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
};

// Only run if this file is executed directly
if (require.main === module) {
  testContactAPI();
}

module.exports = testContactAPI;
