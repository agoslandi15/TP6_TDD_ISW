"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Ticket } from "@/lib/park-data"
import { CreditCard, Lock, AlertCircle, Loader2, Sparkles } from "lucide-react"

function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ticketId = searchParams.get("ticketId")

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  // Card form state
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  useEffect(() => {
    if (!ticketId) {
      router.push("/")
      return
    }

    // Load ticket from localStorage
    const tickets = JSON.parse(localStorage.getItem("park_tickets") || "[]")
    const foundTicket = tickets.find((t: Ticket) => t.id === ticketId)

    if (!foundTicket) {
      router.push("/")
      return
    }

    setTicket(foundTicket)
  }, [ticketId, router])

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    const chunks = cleaned.match(/.{1,4}/g)
    return chunks ? chunks.join(" ") : cleaned
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
    }
    return cleaned
  }

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
      setCardNumber(formatCardNumber(cleaned))
    }
  }

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length <= 4) {
      setExpiryDate(formatExpiryDate(cleaned))
    }
  }

  const handleCvvChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCvv(value)
    }
  }

  const validateForm = (): boolean => {
    if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
      setError("Número de tarjeta inválido")
      return false
    }

    if (!cardName.trim()) {
      setError("Ingresa el nombre del titular")
      return false
    }

    if (!expiryDate || expiryDate.length !== 5) {
      setError("Fecha de vencimiento inválida")
      return false
    }

    const [month, year] = expiryDate.split("/")
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1

    if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
      setError("Mes inválido")
      return false
    }

    if (
      Number.parseInt(year) < currentYear ||
      (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
    ) {
      setError("Tarjeta vencida")
      return false
    }

    if (!cvv || cvv.length < 3) {
      setError("CVV inválido")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    // Simulate payment processing (Mercado Pago)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update ticket status
    const tickets = JSON.parse(localStorage.getItem("park_tickets") || "[]")
    const updatedTickets = tickets.map((t: Ticket) => {
      if (t.id === ticketId) {
        return { ...t, status: "confirmed" }
      }
      return t
    })
    localStorage.setItem("park_tickets", JSON.stringify(updatedTickets))

    // Redirect to confirmation
    router.push(`/confirmation?ticketId=${ticketId}`)
  }

  const fillDemoData = () => {
    setCardNumber("4532 1234 5678 9010")
    setCardName("JUAN PEREZ")
    setExpiryDate("12/25")
    setCvv("123")
    setError("")
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-primary">Pago Seguro</h1>
            <p className="text-muted-foreground">Procesado por Mercado Pago</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Información de Pago
                      </CardTitle>
                      <CardDescription>Ingresa los datos de tu tarjeta de crédito o débito</CardDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={fillDemoData}
                      className="gap-2 border-primary/20 text-primary hover:bg-primary/10 bg-transparent"
                    >
                      <Sparkles className="h-4 w-4" />
                      Datos Demo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nombre del Titular</Label>
                      <Input
                        id="cardName"
                        placeholder="JUAN PEREZ"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        required
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Vencimiento</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/AA"
                          value={expiryDate}
                          onChange={(e) => handleExpiryChange(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => handleCvvChange(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Tu información está protegida con encriptación SSL</span>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary-dark" disabled={isProcessing}>
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando Pago...
                        </>
                      ) : (
                        `Pagar $${ticket.totalAmount.toLocaleString("es-AR")}`
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de Compra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Fecha de Visita</div>
                    <div className="font-semibold">
                      {new Date(ticket.visitDate + "T00:00:00").toLocaleDateString("es-AR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Cantidad de Entradas</div>
                    <div className="font-semibold">
                      {ticket.quantity} {ticket.quantity === 1 ? "entrada" : "entradas"}
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    {ticket.visitors.map((visitor, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Visitante {index + 1} ({visitor.age} años)
                        </span>
                        <span className="font-medium">{visitor.passType}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-display text-2xl font-bold text-primary">
                        ${ticket.totalAmount.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
