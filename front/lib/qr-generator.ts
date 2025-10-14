// Generate a unique alphanumeric ticket code
export function generateTicketCode(ticketId: string): string {
  // Create a unique code based on ticket ID and timestamp
  const prefix = "PARQUE-ECO"
  const hash = ticketId.substring(0, 8).toUpperCase()
  const random = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `${prefix}-${hash}-${random}`
}

// Generate QR code as a data URL using QR Server API
export function generateQRCodeDataURL(ticketId: string, ticketCode: string): string {
  // Use QR Server API to generate QR code
  const qrData = encodeURIComponent(ticketCode)
  const size = 300
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrData}&format=png&color=2d5016&bgcolor=ffffff`

  return qrUrl
}

// Generate QR code as base64 for email attachment
export async function generateQRCodeBase64(ticketCode: string): Promise<string> {
  try {
    const qrData = encodeURIComponent(ticketCode)
    const size = 300
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qrData}&format=png&color=2d5016&bgcolor=ffffff`

    // Fetch the QR code image
    const response = await fetch(qrUrl)
    const blob = await response.blob()

    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        // Remove the data:image/png;base64, prefix
        const base64Data = base64.split(",")[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("[v0] Error generating QR code base64:", error)
    throw error
  }
}
