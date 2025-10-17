"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Ticket } from "@/lib/park-data"
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react"

// Colores de Mercado Pago
const MP_COLORS = {
  primary: "#009ee3",
  background: "#fff159", // Amarillo MP
  headerBg: "#fff159",
  contentBg: "#ffffff",
  text: "#333333",
}

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ticketId = searchParams.get("ticketId")

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [returningToSite, setReturningToSite] = useState(false)

  useEffect(() => {
    if (!ticketId) {
      router.push("/")
      return
    }

    // Obtener datos del ticket desde localStorage (guardado después de la compra exitosa)
    const ticketData = localStorage.getItem(`ticket_${ticketId}`)
    
    if (!ticketData) {
      console.error("No se encontraron datos del ticket")
      router.push("/")
      return
    }

    const foundTicket = JSON.parse(ticketData)
    setTicket(foundTicket)

    // Simular redirección a Mercado Pago
    setRedirecting(true)
  }, [ticketId, router])

  useEffect(() => {
    if (redirecting) {
      const timer = setTimeout(() => {
        setRedirecting(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [redirecting])

  useEffect(() => {
    if (returningToSite) {
      const timer = setTimeout(() => {
        router.push(`/confirmation?ticketId=${ticketId}`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [returningToSite, ticketId, router])

  const handlePayment = async () => {
    if (!ticket) return

    setProcessing(true)

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Actualizar estado del ticket
    if (ticket) {
      const updatedTicket = { ...ticket, status: "confirmed" }
      localStorage.setItem(`ticket_${ticketId}`, JSON.stringify(updatedTicket))
    }

    // Mostrar pantalla de redirección
    setReturningToSite(true)
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (redirecting || returningToSite) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: MP_COLORS.background }}>
        <Loader2 className="h-12 w-12 animate-spin" style={{ color: MP_COLORS.primary }} />
        <h2 className="text-xl font-semibold" style={{ color: MP_COLORS.text }}>
          {redirecting ? "Redirigiendo a Mercado Pago..." : "Redirigiendo a EcoHarmony Park..."}
        </h2>
      </div>
    )
  }

  const formattedDate = new Date(ticket.visit_date + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div className="min-h-screen flex flex-col" style={{ background: MP_COLORS.background }}>
      {/* Barra superior */}
      <div className="w-full py-3 px-4 flex items-center" style={{ background: MP_COLORS.headerBg }}>
        <img
          src="/logomp.jpg"
          alt="Mercado Pago"
          className="h-8"
        />
      </div>

      {/* Contenido principal */}
      <main className="flex-1" style={{ background: MP_COLORS.contentBg }}>
        <div className="max-w-lg mx-auto py-6 px-4">
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Logo y detalles del comercio */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f2fd]">
                    <CreditCard className="h-6 w-6" style={{ color: MP_COLORS.primary }} />
                  </div>
                  <div>
                    <div className="font-medium text-lg" style={{ color: MP_COLORS.text }}>
                      EcoHarmony Park
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {ticket.quantity} {ticket.quantity === 1 ? "entrada" : "entradas"} • {formattedDate}
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-4">
                  <span className="text-lg font-medium" style={{ color: MP_COLORS.text }}>
                    Total a pagar
                  </span>
                  <span className="text-3xl font-semibold" style={{ color: MP_COLORS.text }}>
                    ${ticket.total_amount?.toLocaleString("es-AR") || "0"}
                  </span>
                </div>

                {/* Botón de pago */}
                <Button
                  className="w-full text-white hover:opacity-90 h-14 text-lg"
                  style={{ background: MP_COLORS.primary }}
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Procesando pago...
                    </>
                  ) : (
                    "Pagar"
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Al continuar aceptás los términos y condiciones
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}