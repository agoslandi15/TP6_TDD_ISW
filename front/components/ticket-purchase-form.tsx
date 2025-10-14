"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isParkOpen, getMinDate, calculateTotal, type Ticket } from "@/lib/park-data"
import { Calendar, Users, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react"

interface Visitor {
  age: number
  passType: "VIP" | "Regular"
}

export function TicketPurchaseForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [step, setStep] = useState(1)

  // Form state
  const [visitDate, setVisitDate] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [visitors, setVisitors] = useState<Visitor[]>([{ age: 18, passType: "Regular" }])
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "">("")

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!visitDate) {
      newErrors.visitDate = "Debes seleccionar una fecha de visita"
    } else {
      const selectedDate = new Date(visitDate + "T00:00:00")
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.visitDate = "La fecha debe ser hoy o en el futuro"
      } else if (!isParkOpen(selectedDate)) {
        newErrors.visitDate = "El parque está cerrado en la fecha seleccionada (cerrado los lunes)"
      }
    }

    if (quantity < 1) {
      newErrors.quantity = "Debes seleccionar al menos 1 entrada"
    } else if (quantity > 10) {
      newErrors.quantity = "No puedes comprar más de 10 entradas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {}

    visitors.forEach((visitor, index) => {
      if (!visitor.age || visitor.age < 0) {
        newErrors[`visitor-${index}`] = "Edad inválida"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!paymentMethod) {
      newErrors.paymentMethod = "Debes seleccionar una forma de pago"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    const currentVisitors = [...visitors]

    if (newQuantity > currentVisitors.length) {
      // Add new visitors
      for (let i = currentVisitors.length; i < newQuantity; i++) {
        currentVisitors.push({ age: 18, passType: "Regular" })
      }
    } else if (newQuantity < currentVisitors.length) {
      // Remove excess visitors
      currentVisitors.splice(newQuantity)
    }

    setVisitors(currentVisitors)
  }

  const updateVisitor = (index: number, field: keyof Visitor, value: any) => {
    const newVisitors = [...visitors]
    newVisitors[index] = { ...newVisitors[index], [field]: value }
    setVisitors(newVisitors)
  }

  const handleNext = () => {
    let isValid = false

    if (step === 1) {
      isValid = validateStep1()
    } else if (step === 2) {
      isValid = validateStep2()
    }

    if (isValid) {
      setStep(step + 1)
    }
  }

  const handleSubmit = () => {
    if (!validateStep3()) {
      return
    }

    // Create ticket
    const ticket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user!.id,
      visitDate,
      quantity,
      visitors,
      paymentMethod: paymentMethod as "cash" | "card",
      totalAmount: calculateTotal(visitors),
      purchaseDate: new Date().toISOString(),
      status: "pending",
    }

    // Save ticket to localStorage
    const tickets = JSON.parse(localStorage.getItem("park_tickets") || "[]")
    tickets.push(ticket)
    localStorage.setItem("park_tickets", JSON.stringify(tickets))

    // Redirect based on payment method
    if (paymentMethod === "card") {
      // Redirect to payment page (Mercado Pago simulation)
      router.push(`/payment?ticketId=${ticket.id}`)
    } else {
      // Redirect to confirmation page
      router.push(`/confirmation?ticketId=${ticket.id}`)
    }
  }

  const totalAmount = calculateTotal(visitors)

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-1 items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                  s === step
                    ? "border-primary bg-primary text-white"
                    : s < step
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
              </div>
              {s < 3 && <div className={`h-1 flex-1 transition-colors ${s < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className={step === 1 ? "font-semibold text-primary" : "text-muted-foreground"}>Fecha y Cantidad</span>
          <span className={step === 2 ? "font-semibold text-primary" : "text-muted-foreground"}>
            Datos de Visitantes
          </span>
          <span className={step === 3 ? "font-semibold text-primary" : "text-muted-foreground"}>Pago</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            {step === 1 && "Selecciona Fecha y Cantidad"}
            {step === 2 && "Información de Visitantes"}
            {step === 3 && "Método de Pago"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Elige cuándo quieres visitar el parque y cuántas entradas necesitas"}
            {step === 2 && "Ingresa la edad y tipo de pase para cada visitante"}
            {step === 3 && "Selecciona cómo deseas pagar tus entradas"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Date and Quantity */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="visitDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de Visita
                </Label>
                <Input
                  id="visitDate"
                  type="date"
                  min={getMinDate()}
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className={errors.visitDate ? "border-destructive" : ""}
                />
                {errors.visitDate && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.visitDate}</AlertDescription>
                  </Alert>
                )}
                <p className="text-sm text-muted-foreground">El parque está cerrado los lunes</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Cantidad de Entradas
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  className={errors.quantity ? "border-destructive" : ""}
                />
                {errors.quantity && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.quantity}</AlertDescription>
                  </Alert>
                )}
                <p className="text-sm text-muted-foreground">Máximo 10 entradas por compra</p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext} className="bg-primary hover:bg-primary-dark">
                  Continuar
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Visitor Information */}
          {step === 2 && (
            <>
              <div className="space-y-4">
                {visitors.map((visitor, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Visitante {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`age-${index}`}>Edad</Label>
                          <Input
                            id={`age-${index}`}
                            type="number"
                            min="0"
                            max="120"
                            value={visitor.age}
                            onChange={(e) => updateVisitor(index, "age", Number.parseInt(e.target.value) || 0)}
                            className={errors[`visitor-${index}`] ? "border-destructive" : ""}
                          />
                          {visitor.age < 5 && (
                            <p className="text-sm text-success">50% de descuento para menores de 5 años</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`pass-${index}`}>Tipo de Pase</Label>
                          <Select
                            value={visitor.passType}
                            onValueChange={(value) => updateVisitor(index, "passType", value)}
                          >
                            <SelectTrigger id={`pass-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Regular">Regular - $1,500</SelectItem>
                              <SelectItem value="VIP">VIP - $3,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Atrás
                </Button>
                <Button onClick={handleNext} className="bg-primary hover:bg-primary-dark">
                  Continuar
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Payment Method */}
          {step === 3 && (
            <>
              <div className="space-y-4">
                <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total a Pagar:</span>
                    <span className="font-display text-2xl font-bold text-primary">
                      ${totalAmount.toLocaleString("es-AR")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {quantity} {quantity === 1 ? "entrada" : "entradas"} para el{" "}
                    {new Date(visitDate + "T00:00:00").toLocaleDateString("es-AR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Forma de Pago
                  </Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as "cash" | "card")}
                  >
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Tarjeta de Crédito/Débito</div>
                        <div className="text-sm text-muted-foreground">Pago seguro con Mercado Pago</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Efectivo en Boletería</div>
                        <div className="text-sm text-muted-foreground">Paga al llegar al parque</div>
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.paymentMethod && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors.paymentMethod}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Atrás
                </Button>
                <Button onClick={handleSubmit} className="bg-primary hover:bg-primary-dark">
                  Confirmar Compra
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
