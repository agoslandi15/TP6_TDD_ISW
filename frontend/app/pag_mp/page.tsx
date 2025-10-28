"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Ticket } from "@/lib/park_data"
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react"

// Colores de Mercado Pago
const MP_COLORS = {
  primary: "#009ee3",
  background: "#fff159", // Amarillo MP
  headerBg: "#fff159",
  contentBg: "#ffffff",
  text: "#333333",
}

function MpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ticket_id = searchParams.get("ticketId")

  const [ticket, set_ticket] = useState<Ticket | null>(null)
  const [redirecting, set_redirecting] = useState(false)
  const [processing, set_processing] = useState(false)
  const [returning_to_site, set_returning_to_site] = useState(false)

  useEffect(() => {
    if (!ticket_id) {
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

    // Simular redirección a Mercado Pago
    set_redirecting(true)
  }, [ticket_id, router])

  useEffect(() => {
    if (redirecting) {
      const timer = setTimeout(() => {
        set_redirecting(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [redirecting])

  useEffect(() => {
    if (returning_to_site) {
      const timer = setTimeout(() => {
        router.push(`/pag_confirmacion?ticketId=${ticket_id}`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [returning_to_site, ticket_id, router])

  const handle_payment = async () => {
    if (!ticket) return

    set_processing(true)

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Actualizar estado del ticket
    if (ticket) {
      const updated_ticket = { ...ticket, status: "confirmed" }
      localStorage.setItem(`ticket_${ticket_id}`, JSON.stringify(updated_ticket))
    }

    // Mostrar pantalla de redirección
    set_returning_to_site(true)
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (redirecting || returning_to_site) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: MP_COLORS.background }}>
        <Loader2 className="h-12 w-12 animate-spin" style={{ color: MP_COLORS.primary }} />
        <h2 className="text-lg md:text-xl font-semibold text-center px-4" style={{ color: MP_COLORS.text }}>
          {redirecting ? "Redirigiendo a Mercado Pago..." : "Redirigiendo a EcoHarmony Park..."}
        </h2>
      </div>
    )
  }

  const formatted_date = new Date(ticket.visit_date + "T00:00:00").toLocaleDateString("es-AR", {
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
          onError={(e) => {
            // Si la imagen no carga, mostrar texto como fallback
            e.currentTarget.style.display = 'none';
            const textElement = document.createElement('div');
            textElement.textContent = 'Mercado Pago';
            textElement.className = 'font-bold text-lg';
            textElement.style.color = MP_COLORS.text;
            e.currentTarget.parentNode?.appendChild(textElement);
          }}
        />
      </div>

      {/* Contenido principal */}
      <main className="flex-1" style={{ background: MP_COLORS.contentBg }}>
        <div className="max-w-lg mx-auto py-4 md:py-6 px-4">
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4 md:space-y-6">
                {/* Logo y detalles del comercio */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f2fd]">
                    <CreditCard className="h-6 w-6" style={{ color: MP_COLORS.primary }} />
                  </div>
                  <div>
                    <div className="font-medium text-base md:text-lg" style={{ color: MP_COLORS.text }}>
                      EcoHarmony Park
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {ticket.quantity} {ticket.quantity === 1 ? "entrada" : "entradas"} • {formatted_date}
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-4">
                  <span className="text-base md:text-lg font-medium" style={{ color: MP_COLORS.text }}>
                    Total a pagar
                  </span>
                  <span className="text-2xl md:text-3xl font-semibold" style={{ color: MP_COLORS.text }}>
                    ${ticket.total_amount?.toLocaleString("es-AR") || "0"}
                  </span>
                </div>

                {/* Botón de pago */}
                <Button
                  className="w-full text-white hover:opacity-90 h-14 text-lg"
                  style={{ background: MP_COLORS.primary }}
                  onClick={handle_payment}
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

export default function MpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <MpContent />
    </Suspense>
  )
}