// Generate a unique alphanumeric ticket code
export function generate_ticket_code(ticket_id: string): string {
  // Create a unique code based on ticket ID and timestamp
  const prefix = "PARQUE-ECO"
  const hash = ticket_id.substring(0, 8).toUpperCase()
  const random = Math.random().toString(36).substring(2, 10).toUpperCase()
  return `${prefix}-${hash}-${random}`
}

// Generate QR code as a data URL using QR Server API
export function generate_qr_code_data_url(ticket_id: string, ticket_code: string): string {
  // Use QR Server API to generate QR code
  const qr_data = encodeURIComponent(ticket_code)
  const size = 300
  const qr_url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qr_data}&format=png&color=2d5016&bgcolor=ffffff`

  return qr_url
}

// Generate QR code as base64 for email attachment
export async function generate_qr_code_base64(ticket_code: string): Promise<string> {
  try {
    const qr_data = encodeURIComponent(ticket_code)
    const size = 300
    const qr_url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${qr_data}&format=png&color=2d5016&bgcolor=ffffff`

    // Fetch the QR code image
    const response = await fetch(qr_url)
    const blob = await response.blob()

    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        // Remove the data:image/png;base64, prefix
        const base64_data = base64.split(",")[1]
        resolve(base64_data)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("[v0] Error generating QR code base64:", error)
    throw error
  }
}
