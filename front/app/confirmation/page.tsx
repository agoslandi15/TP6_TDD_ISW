"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailPreview } from "@/components/email-preview"
import type { Ticket } from "@/lib/park-data"
import { sendConfirmationEmail, getEmailsByTicketId } from "@/lib/email-service"
import { CheckCircle2, Calendar, Users, CreditCard, Download, Home, Loader2, QrCode, Hash } from "lucide-react"

function ConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const ticketId = searchParams.get("ticketId")

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [emailContent, setEmailContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [ticketCode, setTicketCode] = useState<string>("")
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    const loadTicketAndSendEmail = async () => {
      if (!ticketId || !user) {
        router.push("/")
        return
      }

      const tickets = JSON.parse(localStorage.getItem("park_tickets") || "[]")
      const foundTicket = tickets.find((t: Ticket) => t.id === ticketId)

      if (!foundTicket) {
        router.push("/")
        return
      }

      setTicket(foundTicket)

      const existingEmails = getEmailsByTicketId(ticketId)

      if (existingEmails.length === 0) {
        const result = await sendConfirmationEmail({
          to: user.email,
          userName: user.name,
          ticket: foundTicket,
        })

        if (result.success) {
          setTicketCode(result.code)
          setQrCodeUrl(result.qrUrl)
          if (result.testMode) {
            console.log("[v0] Email sent in test mode to:", result.sentTo)
          }
        }
      } else {
        setTicketCode(existingEmails[0].ticketCode || "")
        setQrCodeUrl(existingEmails[0].qrCodeUrl || "")
      }

      const emails = getEmailsByTicketId(ticketId)
      if (emails.length > 0) {
        setEmailContent(emails[0].content)
      }

      setIsLoading(false)
    }

    loadTicketAndSendEmail()
  }, [ticketId, user, router])

  const handleDownloadTicket = () => {
    if (!ticket) return

    const ticketText = `
PARQUE ECOLÓGICO - ENTRADA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CÓDIGO DE ENTRADA: ${ticketCode}

Número de Orden: ${ticket.id.toUpperCase()}
Fecha de Compra: ${new Date(ticket.purchaseDate).toLocaleDateString("es-AR")}

FECHA DE VISITA
${new Date(ticket.visitDate + "T00:00:00").toLocaleDateString("es-AR", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})}

CANTIDAD DE ENTRADAS: ${ticket.quantity}

VISITANTES:
${ticket.visitors
  .map(
    (visitor, index) => `
${index + 1}. Edad: ${visitor.age} años | Pase: ${visitor.passType}
`,
  )
  .join("")}

TOTAL PAGADO: $${ticket.totalAmount.toLocaleString("es-AR")}
MÉTODO DE PAGO: ${ticket.paymentMethod === "card" ? "Tarjeta" : "Efectivo en Boletería"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Presenta este comprobante y el código ${ticketCode} al ingresar
    `.trim()

    const blob = new Blob([ticketText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `entrada-parque-${ticket.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading || !ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const visitDate = new Date(ticket.visitDate + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Success Message */}
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-primary">Compra Confirmada</h1>
                  <p className="mt-2 text-lg text-muted-foreground">Tu compra ha sido procesada exitosamente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code and Ticket Code Display */}
          {ticketCode && (
            <Card className="border-2 border-primary">
              <CardHeader className="bg-primary/5">
                <CardTitle className="font-display text-2xl text-center">Tu Código de Entrada</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* QR Code */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <QrCode className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Código QR</h3>
                    {qrCodeUrl && (
                      <div className="rounded-lg border-4 border-primary/20 bg-white p-4">
                        <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="h-48 w-48" />
                      </div>
                    )}
                    <p className="text-sm text-center text-muted-foreground">
                      Escanea este código al ingresar al parque
                    </p>
                  </div>

                  {/* Alphanumeric Code */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Hash className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Código Alternativo</h3>
                    <div className="rounded-lg border-4 border-primary/20 bg-primary/5 p-6">
                      <p className="font-mono text-3xl font-bold text-primary tracking-wider">{ticketCode}</p>
                    </div>
                    <p className="text-sm text-center text-muted-foreground">Usa este código si el QR no funciona</p>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-accent/10 border border-accent/20 p-4">
                  <p className="text-sm text-center font-medium text-accent-foreground">
                    💡 Guarda este código o toma una captura de pantalla. También lo recibirás por email.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Detalles de tu Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Fecha de Visita</div>
                    <div className="font-semibold">{visitDate}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Cantidad de Entradas</div>
                    <div className="font-semibold">
                      {ticket.quantity} {ticket.quantity === 1 ? "entrada" : "entradas"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Método de Pago</div>
                    <div className="font-semibold">
                      {ticket.paymentMethod === "card" ? "Tarjeta de Crédito/Débito" : "Efectivo en Boletería"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Pagado</div>
                    <div className="font-display text-xl font-bold text-primary">
                      ${ticket.totalAmount.toLocaleString("es-AR")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="mb-4 font-semibold">Visitantes</h3>
                <div className="space-y-3">
                  {ticket.visitors.map((visitor, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <span className="font-medium">Visitante {index + 1}</span>
                        <span className="ml-2 text-sm text-muted-foreground">({visitor.age} años)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            visitor.passType === "VIP"
                              ? "bg-secondary/20 text-secondary-dark"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {visitor.passType}
                        </span>
                        {visitor.age < 5 && (
                          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                            50% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {ticket.paymentMethod === "cash" && (
                <div className="rounded-lg border-2 border-warning/20 bg-warning/5 p-4">
                  <p className="font-semibold text-warning-dark">Importante:</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Recuerda llevar el efectivo al llegar al parque. Presenta tu comprobante en la boletería para
                    retirar tus entradas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Preview */}
          {emailContent && <EmailPreview content={emailContent} />}

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleDownloadTicket} variant="outline" className="flex-1 gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Descargar Comprobante
            </Button>
            <Button onClick={() => router.push("/")} className="flex-1 gap-2 bg-primary hover:bg-primary-dark">
              <Home className="h-4 w-4" />
              Volver al Inicio
            </Button>
          </div>

          {/* Additional Info */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="mb-3 font-semibold">Información Importante</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>El parque está abierto de martes a domingo, de 9:00 AM a 6:00 PM</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Presenta tu comprobante y el código {ticketCode} al ingresar al parque</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Las entradas no son reembolsables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>
                    Se ha enviado un email de confirmación a iansp1111@gmail.com (modo de prueba). Para enviar a otros
                    emails, verifica un dominio en resend.com/domains
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
