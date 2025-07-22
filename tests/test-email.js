const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env.local" });

async function testEmailConfig() {
  console.log("🧪 Testing Email Configuration...\n");

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log("📧 Email Configuration:");
    console.log(`Host: ${process.env.EMAIL_HOST}`);
    console.log(`Port: ${process.env.EMAIL_PORT}`);
    console.log(`User: ${process.env.EMAIL_USER}`);
    console.log(`From Name: ${process.env.EMAIL_FROM_NAME}\n`);

    // Verify connection
    console.log("🔄 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!\n");

    // Send test email
    console.log("📤 Sending test email...");
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER,
      subject: "🧪 MediSync Hub - Email Test",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb;">MediSync Hub Email Test</h1>
          <p>This is a test email to verify that the contact form email functionality is working correctly.</p>
          <p><strong>Test performed at:</strong> ${new Date().toLocaleString()}</p>
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0369a1;">✅ Email configuration is working properly!</p>
          </div>
        </div>
      `,
    });

    console.log("✅ Test email sent successfully!");
    console.log(`Message ID: ${info.messageId}\n`);
    console.log("🎉 Email configuration test completed successfully!");
  } catch (error) {
    console.error("❌ Email configuration test failed:");
    console.error(error.message);

    if (error.code === "EAUTH") {
      console.log("\n💡 Authentication failed. Please check:");
      console.log("1. Your Gmail app password is correct");
      console.log(
        "2. 2-factor authentication is enabled on your Gmail account"
      );
      console.log("3. App password is used instead of regular password");
    }
  }
}

testEmailConfig();
