import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, from } = await request.json();

    // Validate required fields
    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and body are required" },
        { status: 400 }
      );
    }

    // Check if email is configured
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASSWORD
    ) {
      return NextResponse.json(
        {
          error:
            "Email not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD in your .env.local file.",
        },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: from || process.env.SMTP_FROM || process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, "<br>"), // Convert newlines to HTML breaks
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      to,
      subject,
      sentAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to send email",
        details: error.code || undefined,
      },
      { status: 500 }
    );
  }
}
