import type { Ticket } from "./park-data"
import { generateTicketCode, generateQRCodeDataURL, generateQRCodeBase64 } from "./qr-generator"

interface EmailData {
  to: string
  userName: string
  ticket: Ticket
}

export async function sendConfirmationEmail(
  data: EmailData,
): Promise<{ success: boolean; code: string; qrUrl: string; testMode?: boolean; sentTo?: string }> {
  try {
    // Generate unique code and QR
    const ticketCode = generateTicketCode(data.ticket.id)
    const qrCodeUrl = generateQRCodeDataURL(data.ticket.id, ticketCode)

    const emailContent = generateEmailHTML(data, ticketCode)

    const qrCodeBase64 = await generateQRCodeBase64(ticketCode)

    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: data.to,
        subject: "Confirmación de Compra - EcoHarmony Park",
        html: emailContent,
        ticketCode: ticketCode,
        qrCodeBase64: qrCodeBase64, // Send base64 instead of URL
      }),
    })

    const result = await response.json()

    if (!result.success) {
      console.error("[v0] Failed to send email:", result.error)
      // Still store locally for demonstration even if email fails
    } else {
      console.log("[v0] Email sent successfully via Resend!")
    }

    // Store email in localStorage for demonstration
    const emails = JSON.parse(localStorage.getItem("park_emails") || "[]")
    emails.push({
      id: Math.random().toString(36).substr(2, 9),
      to: data.to,
      subject: "Confirmación de Compra - EcoHarmony Park",
      content: generateEmailContent(data, ticketCode),
      sentAt: new Date().toISOString(),
      ticketId: data.ticket.id,
      ticketCode,
      qrCodeUrl,
    })
    localStorage.setItem("park_emails", JSON.stringify(emails))

    return { 
      success: true, 
      code: ticketCode, 
      qrUrl: qrCodeUrl,
      testMode: result.testMode,
      sentTo: result.sentTo
    }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return { success: false, code: "", qrUrl: "" }
  }
}

function generateEmailHTML(data: EmailData, ticketCode: string): string {
  const { userName, ticket } = data
  const visitDate = new Date(ticket.visitDate + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Compra - EcoHarmony Park</title>
</head>
<body style="margin: 0; padding: 0; font-family: Montserrat, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
           Header 
          <tr>
            <td style="background: linear-gradient(135deg, #2d5016 0%, #4a7c2c 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🌿 EcoHarmony Park 🌿</h1>
              <p style="color: #e8f5e9; margin: 10px 0 0 0; font-size: 16px;">Confirmación de Compra</p>
            </td>
          </tr>
          
           Greeting 
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <h2 style="color: #2d5016; margin: 0 0 15px 0; font-size: 24px;">¡Hola ${userName}!</h2>
              <p style="color: #666; line-height: 1.6; margin: 0;">Gracias por tu compra. Tu entrada ha sido confirmada exitosamente.</p>
            </td>
          </tr>
          
           Ticket Code 
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-radius: 8px; border: 2px solid #4a7c2c;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="color: #2d5016; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">TU CÓDIGO DE ENTRADA</p>
                    <p style="color: #2d5016; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 3px; font-family: 'Courier New', monospace;">${ticketCode}</p>
                    <p style="color: #4a7c2c; margin: 15px 0 0 0; font-size: 13px;">Presenta este código al ingresar al parque</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
           Visit Details 
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <h3 style="color: #2d5016; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e8f5e9; padding-bottom: 10px;">Detalles de tu Visita</h3>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">📅 Fecha de Visita:</td>
                  <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${visitDate}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">🎫 Cantidad de Entradas:</td>
                  <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${ticket.quantity}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">💳 Método de Pago:</td>
                  <td style="color: #333; font-size: 14px; font-weight: bold; text-align: right; padding: 8px 0;">${ticket.paymentMethod === "card" ? "Tarjeta" : "Efectivo"}</td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 14px; padding: 8px 0;">💰 Total:</td>
                  <td style="color: #2d5016; font-size: 18px; font-weight: bold; text-align: right; padding: 8px 0;">$${ticket.totalAmount.toLocaleString("es-AR")}</td>
                </tr>
              </table>
            </td>
          </tr>
          
           Visitors 
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="color: #2d5016; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e8f5e9; padding-bottom: 10px;">Visitantes</h3>
              ${ticket.visitors
                .map(
                  (visitor, index) => `
                <div style="background-color: #f9f9f9; border-left: 3px solid #4a7c2c; padding: 12px; margin-bottom: 10px; border-radius: 4px;">
                  <p style="margin: 0; color: #333; font-size: 14px;"><strong>Visitante ${index + 1}:</strong> ${visitor.age} años - Pase ${visitor.passType}</p>
                  ${visitor.age < 5 ? '<p style="margin: 5px 0 0 0; color: #4a7c2c; font-size: 12px;">✓ Descuento 50% aplicado</p>' : ""}
                </div>
              `,
                )
                .join("")}
            </td>
          </tr>
          
           Important Info 
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff8e1; border-radius: 8px; border: 1px solid #ffd54f;">
                <tr>
                  <td style="padding: 20px;">
                    <h4 style="color: #f57c00; margin: 0 0 10px 0; font-size: 16px;">📌 Información Importante</h4>
                    <ul style="color: #666; margin: 0; padding-left: 20px; line-height: 1.8; font-size: 13px;">
                      <li>El parque abre de martes a domingo, 9:00 AM - 6:00 PM</li>
                      <li>Presenta tu código QR (adjunto) o el código ${ticketCode}</li>
                      <li>Si el QR no funciona, usa el código alfanumérico</li>
                      ${ticket.paymentMethod === "cash" ? "<li><strong>Recuerda llevar el efectivo al llegar</strong></li>" : ""}
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
           Footer 
          <tr>
            <td style="background-color: #f5f5f5; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; margin: 0 0 10px 0; font-size: 13px;">¡Esperamos verte pronto en EcoHarmony Park!</p>
              <p style="color: #999; margin: 0; font-size: 12px;">
                <a href="mailto:ecoharmonypark@gmail.com" style="color: #4a7c2c; text-decoration: none;">ecoharmonypark@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// Keep text version for localStorage preview
function generateEmailContent(data: EmailData, ticketCode: string): string {
  const { userName, ticket } = data
  const visitDate = new Date(ticket.visitDate + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
Hola ${userName},

¡Gracias por tu compra en EcoHarmony Park!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TU CÓDIGO DE ENTRADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${ticketCode}

Presenta este código al ingresar al parque.
También encontrarás un código QR adjunto en este email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DETALLES DE TU COMPRA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Número de Orden: ${ticket.id.toUpperCase()}
Fecha de Compra: ${new Date(ticket.purchaseDate).toLocaleDateString("es-AR")}
Estado: ${ticket.status === "confirmed" ? "CONFIRMADO" : "PENDIENTE"}

INFORMACIÓN DE LA VISITA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Fecha de Visita: ${visitDate}
Cantidad de Entradas: ${ticket.quantity}

VISITANTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${ticket.visitors
  .map(
    (visitor, index) => `
Visitante ${index + 1}:
  - Edad: ${visitor.age} años
  - Tipo de Pase: ${visitor.passType}
  ${visitor.age < 5 ? "  - Descuento aplicado: 50% (menor de 5 años)" : ""}
`,
  )
  .join("\n")}

PAGO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Método de Pago: ${ticket.paymentMethod === "card" ? "Tarjeta de Crédito/Débito" : "Efectivo en Boletería"}
Total Pagado: $${ticket.totalAmount.toLocaleString("es-AR")}

${
  ticket.paymentMethod === "cash"
    ? `
IMPORTANTE: Recuerda llevar el efectivo al llegar al parque.
Presenta este email en la boletería para retirar tus entradas.
`
    : ""
}

INFORMACIÓN IMPORTANTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- El parque abre de martes a domingo
- Horario: 9:00 AM - 6:00 PM
- Presenta tu código QR o el código ${ticketCode} al ingresar
- Si el QR no funciona, usa el código alfanumérico
- Las entradas no son reembolsables

¡Esperamos verte pronto en EcoHarmony Park!

Atentamente,
🌿 Grupo 3 - EcoHarmony Park 🌿
ecoharmonypark@gmail.com
  `.trim()
}

export function getEmailsByTicketId(ticketId: string) {
  const emails = JSON.parse(localStorage.getItem("park_emails") || "[]")
  return emails.filter((email: any) => email.ticketId === ticketId)
}
