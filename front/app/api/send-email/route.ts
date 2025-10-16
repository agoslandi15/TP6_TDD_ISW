import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, html, ticketCode, qrCodeBase64 } = body

    // Once you verify a domain at resend.com/domains, you can change this back to the user's email
    const testModeEmail = "iansp1111@gmail.com"
    const recipientEmail = testModeEmail // Change to 'to' after domain verification

    console.log("[v0] Sending email to:", recipientEmail, "(test mode)")

    const { data, error } = await resend.emails.send({
      from: "EcoHarmony Park - G3 <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: subject,
      html: html,
      attachments: [
        {
          filename: `entrada-${ticketCode}.png`,
          content: qrCodeBase64, // Use base64 directly
        },
      ],
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log("[v0] Email sent successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      emailId: data?.id,
      testMode: true,
      sentTo: recipientEmail,
    })
  } catch (error) {
    console.error("[v0] Error in email API:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 },
    )
  }
}
