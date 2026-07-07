import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string; // honeypot
};

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "ShopPeak <onboarding@resend.dev>";
const supportEmail = process.env.SUPPORT_TO_EMAIL || process.env.CONTACT_TO_EMAIL || "support@shoppeak.com";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function ticketId() {
  const short = crypto.randomUUID().split("-")[0].toUpperCase();
  return `SP-${short}`;
}

function buildAdminHtml(data: {
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 12px;">New ShopPeak Support Request</h2>
      <p style="margin:0 0 8px;"><strong>Ticket ID:</strong> ${escapeHtml(data.ticketId)}</p>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p style="margin:0 0 8px;"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
      <p style="margin:0 0 8px;"><strong>Created At:</strong> ${escapeHtml(data.createdAt)}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
      <p style="margin:0 0 8px;"><strong>Message:</strong></p>
      <div style="white-space:pre-wrap;background:#f9fafb;padding:14px;border-radius:10px;border:1px solid #e5e7eb;">
        ${escapeHtml(data.message)}
      </div>
    </div>
  `;
}

function buildAdminText(data: {
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}) {
  return [
    "New ShopPeak Support Request",
    `Ticket ID: ${data.ticketId}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Subject: ${data.subject}`,
    `Created At: ${data.createdAt}`,
    "",
    "Message:",
    data.message,
  ].join("\n");
}

function buildUserHtml(data: {
  ticketId: string;
  name: string;
  subject: string;
}) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 12px;">We received your message</h2>
      <p style="margin:0 0 8px;">Hi ${escapeHtml(data.name)},</p>
      <p style="margin:0 0 8px;">
        Thanks for contacting ShopPeak. Your request has been received and our team will review it shortly.
      </p>
      <p style="margin:0 0 8px;"><strong>Ticket ID:</strong> ${escapeHtml(data.ticketId)}</p>
      <p style="margin:0 0 8px;"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
      <p style="margin:16px 0 0;">We usually reply within 24–48 hours.</p>
    </div>
  `;
}

function buildUserText(data: {
  ticketId: string;
  name: string;
  subject: string;
}) {
  return [
    `Hi ${data.name},`,
    "",
    "Thanks for contacting ShopPeak. Your request has been received and our team will review it shortly.",
    "",
    `Ticket ID: ${data.ticketId}`,
    `Subject: ${data.subject}`,
    "",
    "We usually reply within 24–48 hours.",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    if (!resend) {
      return NextResponse.json(
        { ok: false, error: "RESEND_API_KEY is missing." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as ContactBody;

    const name = normalizeText(body.name);
    const email = normalizeText(body.email).toLowerCase();
    const subject = normalizeText(body.subject);
    const message = normalizeText(body.message);
    const honeypot = normalizeText(body.website);

    if (honeypot) {
      return NextResponse.json(
        { ok: true, ticketId: ticketId(), message: "Submitted." },
        { status: 200 }
      );
    }

    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Please enter a valid email." }, { status: 400 });
    }

    if (!subject) {
      return NextResponse.json({ ok: false, error: "Please choose a subject." }, { status: 400 });
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Please write a longer message." },
        { status: 400 }
      );
    }

    if (name.length > 80 || subject.length > 120 || message.length > 3000) {
      return NextResponse.json(
        { ok: false, error: "One of the fields is too long." },
        { status: 400 }
      );
    }

    const id = ticketId();
    const createdAt = new Date().toISOString();

    const adminEmail = await resend.emails.send({
      from: fromEmail,
      to: [supportEmail],
      subject: `New Contact Request — ${subject} (${id})`,
      html: buildAdminHtml({ ticketId: id, name, email, subject, message, createdAt }),
      text: buildAdminText({ ticketId: id, name, email, subject, message, createdAt }),
      headers: {
        "Idempotency-Key": `${id}-admin`,
      },
    });

    if (adminEmail.error) {
      return NextResponse.json(
        { ok: false, error: adminEmail.error.message || "Failed to notify support." },
        { status: 500 }
      );
    }

    const autoReply = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `We received your message — ${subject}`,
      html: buildUserHtml({ ticketId: id, name, subject }),
      text: buildUserText({ ticketId: id, name, subject }),
      headers: {
        "Idempotency-Key": `${id}-user`,
      },
    });

    if (autoReply.error) {
      return NextResponse.json(
        { ok: true, ticketId: id, message: "Support notified, but auto-reply failed." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        ticketId: id,
        message: "Your message has been sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}