import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export async function POST(request: Request) {
  // Debug logs to help troubleshoot
  console.log("API route called");
  console.log("Resend API Key configured:", !!resendApiKey);

  try {
    // Parse the request body
    const body = await request.json();
    const { email } = body;

    console.log("Received email:", email);

    if (!email) {
      console.log("Error: No email provided");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!resendApiKey) {
      console.log("Error: Resend API key not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Validate email format with a basic regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Error: Invalid email format");
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log("Attempting to send email...");

    // Send notification email
    const data = await resend.emails.send({
      from: "API Flow Studio <onboarding@apiflowstudio.com>", // Use the default Resend sender initially
      to: [email],
      subject: "API Flow Studio Launch Notification",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>API Flow Studio</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background: linear-gradient(135deg, #6366F1, #8B5CF6);
              border-radius: 8px 8px 0 0;
            }
            .header img {
              max-width: 180px;
              height: auto;
            }
            .content {
              padding: 30px 20px;
              background-color: #f9fafb;
              border-radius: 0 0 8px 8px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            h1 {
              color: #4F46E5;
              font-size: 24px;
              margin-bottom: 20px;
              text-align: center;
            }
            p {
              margin-bottom: 16px;
              font-size: 16px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6B7280;
              font-size: 14px;
            }
            .social-links {
              margin: 20px 0;
              text-align: center;
            }
            .social-links a {
              display: inline-block;
              margin: 0 10px;
              color: #4F46E5;
              text-decoration: none;
            }
            .button {
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 4px;
              font-weight: 500;
              margin: 20px 0;
            }
            .button-container {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://apiflowstudio.com/apiflowstudiologo.png" alt="API Flow Studio Logo">
            </div>
            <div class="content">
              <h1>Thanks for your interest in API Flow Studio!</h1>
              <p>We're working hard to build something amazing and we're excited to have you join us on this journey.</p>
              <p>We'll notify you as soon as we launch so you can be one of the first to experience API Flow Studio.</p>
              
              <div class="button-container">
                <a href="https://apiflowstudio.com" class="button">Learn More</a>
              </div>
              
              <p>In the meantime, feel free to follow our journey on social media for updates and behind-the-scenes content.</p>
              
              <div class="social-links">
                <a href="https://twitter.com/apiflowstudio">Twitter</a> • 
                <a href="https://linkedin.com/company/apiflowstudio">LinkedIn</a> • 
                <a href="https://github.com/apiflowstudio">GitHub</a>
              </div>
              
              <div class="footer">
                <p>© 2023 API Flow Studio. All rights reserved.</p>
                <p>If you didn't sign up for notifications, please ignore this email.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", data);

    return NextResponse.json({
      success: true,
      message: "You have been added to our notification list!",
      data,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
