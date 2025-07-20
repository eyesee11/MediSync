import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message, phone, subject } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content for company
    const companyEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">MediSync Hub</h1>
          <p style="color: #666; margin: 5px 0;">New Contact Form Submission</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #1e40af; margin-top: 0;">Contact Details</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 6px;">
          <h3 style="color: #374151; margin-top: 0;">Message</h3>
          <p style="line-height: 1.6; color: #4b5563;">${message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #eff6ff; border-radius: 6px; border-left: 4px solid #2563eb;">
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            <strong>Received:</strong> ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    // Auto-reply email content for the sender
    const autoReplyContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">MediSync Hub</h1>
          <p style="color: #666; margin: 5px 0;">Thank you for contacting us!</p>
        </div>
        
        <div style="padding: 20px; background-color: #f0f9ff; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #0369a1; margin-top: 0;">Dear ${name},</h2>
          <p style="line-height: 1.6; color: #374151;">
            Thank you for reaching out to MediSync Hub. We have received your message and our team will review it shortly.
          </p>
          <p style="line-height: 1.6; color: #374151;">
            We typically respond to inquiries within 24-48 hours during business days. If your matter is urgent, 
            please feel free to call us directly.
          </p>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0;">Your Message Summary</h3>
          <p style="background-color: #f9fafb; padding: 15px; border-radius: 4px; color: #4b5563; line-height: 1.6;">
            "${message}"
          </p>
        </div>
        
        <div style="background-color: #ecfdf5; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981;">
          <h3 style="color: #047857; margin-top: 0;">Contact Information</h3>
          <p style="margin: 5px 0; color: #065f46;"><strong>Email:</strong> weaboo1164@gmail.com</p>
          <p style="margin: 5px 0; color: #065f46;"><strong>Website:</strong> MediSync Hub</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Best regards,<br>
            <strong style="color: #2563eb;">The MediSync Hub Team</strong>
          </p>
        </div>
      </div>
    `;

    // Send email to company
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission - ${subject || "General Inquiry"}`,
      html: companyEmailContent,
    });

    // Send auto-reply to user
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Thank you for contacting MediSync Hub",
      html: autoReplyContent,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been sent successfully! We'll get back to you soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      {
        error: "Failed to send message. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
