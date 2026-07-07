import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  company?: string; // honeypot
};

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const TO_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || "kg1338426@gmail.com";
const FROM_EMAIL = process.env.CONTACT_SENDER_EMAIL || "ShopPeak <onboarding@resend.dev>";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Resend API key is missing." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as ContactPayload;

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const company = String(body.company || "").trim();

    if (company) {
      return NextResponse.json(
        { success: false, error: "Spam detected." },
        { status: 400 }
      );
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { success: false, error: "Message is too short." },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || "Unknown";
    const forwardedFor = req.headers.get("x-forwarded-for") || "Unknown";
    const timestamp = new Date().toISOString();

    const emailSubject = `[ShopPeak Support] ${subject}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 16px;">New Support Message</h2>

        <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 720px;">
          <tr>
            <td style="padding: 8px 0; width: 140px; font-weight: bold;">Name</td>
            <td style="padding: 8px 0;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email</td>
            <td style="padding: 8px 0;">${escapeHtml(email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Subject</td>
            <td style="padding: 8px 0;">${escapeHtml(subject)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Message</td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${escapeHtml(message)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Timestamp</td>
            <td style="padding: 8px 0;">${escapeHtml(timestamp)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">IP</td>
            <td style="padding: 8px 0;">${escapeHtml(forwardedFor)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">User Agent</td>
            <td style="padding: 8px 0;">${escapeHtml(userAgent)}</td>
          </tr>
        </table>
      </div>
    `;

    const text = [
      `New Support Message`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      `Message: ${message}`,
      `Timestamp: ${timestamp}`,
      `IP: ${forwardedFor}`,
      `User Agent: ${userAgent}`,
    ].join("\n");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: emailSubject,
        html,
        text,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            (data && (data.error || data.message)) ||
            "Failed to send email.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}