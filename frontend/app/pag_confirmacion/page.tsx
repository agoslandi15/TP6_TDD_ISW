"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { use_auth } from "@/lib/auth_context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Ticket } from "@/lib/park_data"
import { CheckCircle2, Calendar, Users, CreditCard, Home, Loader2 } from "lucide-react"

function ConfirmationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = use_auth()
  const ticket_id = searchParams.get("ticketId")

  const [ticket, set_ticket] = useState<Ticket | null>(null)
  const [is_loading, set_is_loading] = useState(true)

  useEffect(() => {
    const load_ticket = async () => {
      if (!ticket_id || !user) {
        router.push("/")
        return
      }

      // Obtener datos del ticket desde localStorage (guardado después de la compra exitosa)
      const ticket_data = localStorage.getItem(`ticket_${ticket_id}`)
      
      if (!ticket_data) {
        console.error("No se encontraron datos del ticket")
        router.push("/")
        return
      }

      const found_ticket = JSON.parse(ticket_data)
      set_ticket(found_ticket)

      set_is_loading(false)
    }

    load_ticket()
  }, [ticket_id, user, router])

  if (is_loading || !ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const visit_date = new Date(ticket.visit_date + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="mx-auto max-w-4xl space-y-4 md:space-y-6 w-full">
          {/* Success Message */}
          <Card className="border-2 border-primary/20 bg-primary/5 w-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">Compra Confirmada</h1>
                  <p className="mt-2 text-base md:text-lg text-muted-foreground">Tu compra ha sido procesada exitosamente</p>
                </div>
                
                {/* Decorative Icons */}
                <div className="mt-4 md:mt-6 flex items-center justify-center gap-4 md:gap-8">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 md:h-16 md:w-16 text-accent">
                    <path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"></path>
                    <path d="M7 16v6"></path>
                    <path d="M13 19v3"></path>
                    <path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"></path>
                  </svg>
                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-12 md:w-12 text-primary">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                  </svg>
                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 md:h-10 md:w-10 text-secondary">
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                    <path d="M20 3v4"></path>
                    <path d="M22 5h-4"></path>
                    <path d="M4 17v2"></path>
                    <path d="M5 18H3"></path>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>



          {/* Ticket Details */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-display text-xl md:text-2xl">Detalles de tu Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Fecha de Visita</div>
                    <div className="font-semibold">{visit_date}</div>
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
                      {ticket.payment_method === "card" ? "Tarjeta de Crédito (Mercado Pago)" : "Efectivo en Boletería"}
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
                      ${ticket.total_amount?.toLocaleString("es-AR") || "0"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="mb-4 font-semibold">Visitantes</h3>
                <div className="space-y-3">
                  {ticket.visitors.map((visitor, index) => (
                    <div key={index} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">Visitante {index + 1}</span>
                          <span className="ml-2 text-sm text-muted-foreground">({visitor.age} años)</span>
                        </div>
                        <span
                          className={`rounded-full px-2 md:px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                            visitor.pass_type === "VIP"
                              ? "bg-secondary/20 text-secondary-dark"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {visitor.pass_type}
                        </span>
                      </div>
                      {visitor.age !== null && (visitor.age <= 15 && visitor.age >= 4 || visitor.age <= 3 || visitor.age >= 60) && (
                        <div className="flex gap-1 flex-wrap">
                          {visitor.age <= 15 && visitor.age >= 4 && (
                            <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                              50% OFF
                            </span>
                          )}
                          {(visitor.age <= 3 || visitor.age >= 60) && (
                            <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                              GRATIS
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {ticket.payment_method === "cash" && (
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

          {/* Email Preview - Temporarily removed */}

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => router.push("/")} className="flex-1 gap-2 bg-primary hover:bg-primary-dark h-12 text-base md:h-10 md:text-sm">
              <Home className="h-4 w-4" />
              Volver al Inicio
            </Button>
          </div>

          {/* Additional Info */}
          <Card className="bg-muted/50 w-full">
            <CardContent className="pt-6">
              <h3 className="mb-3 font-semibold">Información Importante</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-primary">•</span>
                  <span className="leading-relaxed">El parque está abierto de martes a domingo, de 9:00 AM a 6:00 PM</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-primary">•</span>
                  <span className="leading-relaxed">Se le envió un mail a <strong>{user?.email}</strong> con su comprobante de compra y entrada</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-primary">•</span>
                  <span className="leading-relaxed">Las entradas no son reembolsables</span>
                </li>
                {/* <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>
                    Se ha enviado un email de confirmación a iansp1111@gmail.com (modo de prueba). Para enviar a otros
                    emails, verifica un dominio en resend.com/domains
                  </span>
                </li> */}
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
