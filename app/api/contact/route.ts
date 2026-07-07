import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Resend Engine Initialization
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Strict Validation Engine
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required to process dispatch." },
        { status: 400 }
      );
    }

    // TARGET DELIVERY DESTINATION (Your internal inbound email)
    const MY_INBOX_EMAIL = "kg1338426@gmail.com";

    // Dispatching Inbound Notification via Resend directly to your inbox
    const emailResponse = await resend.emails.send({
      from: "ShopPeak Contact Form <onboarding@resend.dev>", // Replace with your verified custom domain once live (e.g., system@shoppeak.com)
      to: MY_INBOX_EMAIL,
      replyTo: email, // Directly allows you to click 'Reply' inside your mail client to contact the user back
      subject: `[${subject}] New Form Submission from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; color: #111827; background-color: #f9fafb; border-radius: 16px; border: 1px solid #e5e7eb; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-top: 0;">New ShopPeak Contact Lead</h2>
          
          <table style="width: 100%; margin-top: 16px; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px; color: #4b5563;">User Name:</td>
              <td style="padding: 6px 0; color: #111827;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #4b5563;">User Email:</td>
              <td style="padding: 6px 0; color: #2563eb;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #4b5563;">Category/Subject:</td>
              <td style="padding: 6px 0; color: #111827; font-weight: 600;">${subject}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; background-color: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #e5e7eb; min-height: 100px; white-space: pre-wrap;">
            <strong style="color: #4b5563; display: block; margin-bottom: 8px;">Message Content:</strong>
            ${message}
          </div>

          <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 12px;">
            This transmission was triggered in real-time by the ShopPeak contact module.
          </p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error("Resend Core Error State:", emailResponse.error);
      return NextResponse.json(
        { error: emailResponse.error.message || "Failed via Resend dispatch pipeline." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Inbound stream delivered." }, { status: 200 });

  } catch (error: any) {
    console.error("Fatal Contact Pipeline Failure:", error);
    return NextResponse.json(
      { error: "Internal crash encountered during message routing." },
      { status: 500 }
    );
  }
}
