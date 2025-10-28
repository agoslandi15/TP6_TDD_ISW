"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { use_auth } from "@/lib/auth_context"
import { use_comprar_entradas } from "../hooks/use_comprar_entradas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio_group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { is_park_open, get_min_date, calculate_total, type Ticket, is_christmas, is_new_year, is_within_one_month } from "@/lib/park_data"
import { Calendar, Users, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react"

interface Visitor {
  age: number | null
  pass_type: "VIP" | "Regular"
}

export function TicketPurchaseForm() {
  const router = useRouter()
  const { user } = use_auth()
  const [step, set_step] = useState(1)

  // Form state
  const [visit_date, set_visit_date] = useState("")
  const [quantity, set_quantity] = useState<number | "">("")
  const [visitors, set_visitors] = useState<Visitor[]>([])
  const [payment_method, set_payment_method] = useState<"cash" | "card" | "">("")

  // Hook para manejar la compra
  const { comprar_entradas, redirect_to_payment, redirect_to_confirmation, is_loading, error: compra_error } = use_comprar_entradas()
  
  // Validation errors
  const [errors, set_errors] = useState<Record<string, string>>({})

  const validate_step_1 = (): boolean => {
    const new_errors: Record<string, string> = {}

    if (!visit_date) {
      new_errors.visitDate = "Debes seleccionar una fecha de visita"
    } else {
      const selected_date = new Date(visit_date + "T00:00:00")
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const error_messages: string[] = []

      if (selected_date < today) {
        error_messages.push("La fecha debe ser hoy o en el futuro")
      } else {
        // Solo validar las otras restricciones si la fecha no está en el pasado
        if (is_christmas(selected_date)) {
          error_messages.push("El parque está cerrado el 25 de diciembre (Navidad)")
        }
        
        if (is_new_year(selected_date)) {
          error_messages.push("El parque está cerrado el 1 de enero (Año Nuevo)")
        }
        
        if (!is_park_open(selected_date)) {
          error_messages.push("El parque está cerrado en la fecha seleccionada (cerrado los lunes)")
        }
        
        if (!is_within_one_month(selected_date)) {
          error_messages.push("Solo puedes comprar entradas con máximo un mes de anticipación")
        }
      }

      if (error_messages.length > 0) {
        new_errors.visitDate = error_messages.join(" • ")
      }
    }

    if (quantity === "" || typeof quantity === "string" || quantity < 1) {
      new_errors.quantity = "Debes ingresar al menos 1 entrada"
    } else if (quantity > 10) {
      new_errors.quantity = "No puedes comprar más de 10 entradas"
    }

    set_errors(new_errors)
    return Object.keys(new_errors).length === 0
  }

  const validate_step_2 = (): boolean => {
    const new_errors: Record<string, string> = {}

    visitors.forEach((visitor, index) => {
      if (visitor.age === null || visitor.age < 0) {
        new_errors[`visitor-${index}`] = "Debes ingresar una edad válida"
      }
    })

    set_errors(new_errors)
    return Object.keys(new_errors).length === 0
  }

  const validate_step_3 = (): boolean => {
    const new_errors: Record<string, string> = {}

    if (!payment_method) {
      new_errors.paymentMethod = "Debes seleccionar una forma de pago"
    }

    set_errors(new_errors)
    return Object.keys(new_errors).length === 0
  }

  const handle_quantity_change = (new_quantity: number | "") => {
    set_quantity(new_quantity)
    
    if (new_quantity === "" || new_quantity < 1) {
      set_visitors([])
      return
    }
    
    const current_visitors = [...visitors]

    if (new_quantity > current_visitors.length) {
      // Add new visitors
      for (let i = current_visitors.length; i < new_quantity; i++) {
        current_visitors.push({ age: null, pass_type: "Regular" })
      }
    } else if (new_quantity < current_visitors.length) {
      // Remove excess visitors
      current_visitors.splice(new_quantity)
    }

    set_visitors(current_visitors)
  }

  const update_visitor = (index: number, field: keyof Visitor, value: any) => {
    const new_visitors = [...visitors]
    new_visitors[index] = { ...new_visitors[index], [field]: value }
    set_visitors(new_visitors)
  }

  const handle_next = () => {
    let is_valid = false

    if (step === 1) {
      is_valid = validate_step_1()
    } else if (step === 2) {
      is_valid = validate_step_2()
    }

    if (is_valid) {
      set_step(step + 1)
    }
  }

  const handle_submit = async () => {
    if (!validate_step_3()) {
      return
    }

    set_errors({})

    try {
      const resultado = await comprar_entradas(
        visit_date,
        typeof quantity === "number" ? quantity : 0,
        visitors,
        payment_method as "cash" | "card",
        user!.email,
        user!.id
      )

      if (resultado.success) {
        // Redirigir según método de pago
        if (payment_method === "card") {
          redirect_to_payment(resultado.codigoEntrada!)
        } else {
          redirect_to_confirmation(resultado.codigoEntrada!)
        }
      } else {
        set_errors({ submit: resultado.error || "Error desconocido al procesar la compra" })
      }
    } catch (error) {
      console.error("Error inesperado:", error)
      set_errors({ submit: "Error inesperado. Por favor, intenta nuevamente." })
    }
  }

  const total_amount = calculate_total(visitors)

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      {/* Progress indicator */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between relative">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                <div 
                  className={`flex-1 h-1 transition-colors ${s <= step ? "bg-primary" : "bg-border"}`} 
                  style={{ visibility: s === 1 ? 'hidden' : 'visible' }} 
                />
                <div
                  className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                    s <= step
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" /> : s}
                </div>
                <div 
                  className={`flex-1 h-1 transition-colors ${s < step ? "bg-primary" : "bg-border"}`}
                  style={{ visibility: s === 3 ? 'hidden' : 'visible' }} 
                />
              </div>
              <span className={`mt-2 text-xs md:text-sm text-center px-1 leading-tight ${step === s ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                {s === 1 && <span className="hidden sm:inline">Fecha y Cantidad</span>}
                {s === 1 && <span className="sm:hidden">Fecha</span>}
                {s === 2 && <span className="hidden sm:inline">Datos de Visitantes</span>}
                {s === 2 && <span className="sm:hidden">Visitantes</span>}
                {s === 3 && "Pago"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="font-display text-xl md:text-2xl">
            {step === 1 && "Selecciona Fecha y Cantidad"}
            {step === 2 && "Información de Visitantes"}
            {step === 3 && "Método de Pago"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Seleccione el día que quiere asistir al parque y la cantidad de entradas a comprar"}
            {step === 2 && "Ingresa la edad y tipo de pase para cada visitante"}
            {step === 3 && "Selecciona cómo deseas pagar tus entradas"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 px-4 md:px-6">
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
                  min={get_min_date()}
                  value={visit_date}
                  onChange={(e) => set_visit_date(e.target.value)}
                  className={`h-12 text-base md:h-10 md:text-sm ${errors.visitDate ? "border-destructive" : ""}`}
                />
                {errors.visitDate && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.visitDate}</AlertDescription>
                  </Alert>
                )}
                <p className="text-sm text-muted-foreground">
                  El parque está cerrado los lunes, 25 de diciembre y 1 de enero. Máximo 1 mes de anticipación.
                </p>
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
                  placeholder="Ingrese la cantidad de entradas"
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      handle_quantity_change('');
                    } else {
                      const num = Number.parseInt(value);
                      if (!isNaN(num)) {
                        handle_quantity_change(num);
                      }
                    }
                  }}
                  className={`h-12 text-base md:h-10 md:text-sm ${errors.quantity ? "border-destructive" : ""}`}
                />
                {errors.quantity && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.quantity}</AlertDescription>
                  </Alert>
                )}
                <p className="text-sm text-muted-foreground">Máximo 10 entradas por compra</p>
              </div>

              <div className="flex justify-end px-2">
                <Button onClick={handle_next} className="bg-primary hover:bg-primary-dark h-12 px-8 text-base md:h-10 md:px-4 md:text-sm w-full max-w-xs md:w-auto">
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
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`age-${index}`}>Edad</Label>
                          <Input
                            id={`age-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Ingrese la edad"
                            value={visitor.age === null ? '' : visitor.age}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                update_visitor(index, "age", null);
                              } else {
                                const num = parseInt(value);
                                if (!isNaN(num) && num >= 0 && num <= 120) {
                                  update_visitor(index, "age", num);
                                }
                              }
                            }}
                            className={`h-12 text-base md:h-10 md:text-sm ${errors[`visitor-${index}`] ? "border-destructive" : ""}`}
                          />
                          {errors[`visitor-${index}`] && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{errors[`visitor-${index}`]}</AlertDescription>
                            </Alert>
                          )}
                          {visitor.age !== null && (
                            <>
                              {(visitor.age <= 3 || visitor.age >= 60) && (
                                <p className="text-sm text-success">✨ Entrada gratuita</p>
                              )}
                              {visitor.age >= 4 && visitor.age <= 15 && (
                                <p className="text-sm text-success">✨ 50% de descuento</p>
                              )}
                            </>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`pass-${index}`}>Tipo de Pase</Label>
                          <Select
                            value={visitor.pass_type}
                            onValueChange={(value) => update_visitor(index, "pass_type", value)}
                          >
                            <SelectTrigger id={`pass-${index}`} className="h-12 text-base md:h-10 md:text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Regular">Regular - $5,000</SelectItem>
                              <SelectItem value="VIP">VIP - $10,000</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-4 gap-2 px-2">
                <Button variant="outline" onClick={() => set_step(1)} className="h-12 px-4 text-base md:h-10 md:px-4 md:text-sm flex-1 max-w-[45%] md:flex-none md:max-w-none">
                  Atrás
                </Button>
                <Button onClick={handle_next} className="bg-primary hover:bg-primary-dark h-12 px-4 text-base md:h-10 md:px-4 md:text-sm flex-1 max-w-[45%] md:flex-none md:max-w-none">
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
                      ${total_amount.toLocaleString("es-AR")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {quantity} {quantity === 1 ? "entrada" : "entradas"} para el{" "}
                    {new Date(visit_date + "T00:00:00").toLocaleDateString("es-AR", {
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
                    value={payment_method}
                    onValueChange={(value) => set_payment_method(value as "cash" | "card")}
                  >
                    <div className="flex items-center space-x-3 rounded-lg border p-4 md:p-3 hover:bg-muted/50 min-h-[72px] md:min-h-[60px]">
                      <RadioGroupItem value="card" id="card" className="mt-1" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-base md:text-sm">Tarjeta de Crédito</div>
                        <div className="text-sm md:text-xs text-muted-foreground">Pago seguro con Mercado Pago</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-lg border p-4 md:p-3 hover:bg-muted/50 min-h-[72px] md:min-h-[60px]">
                      <RadioGroupItem value="cash" id="cash" className="mt-1" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-base md:text-sm">Efectivo en Boletería</div>
                        <div className="text-sm md:text-xs text-muted-foreground">Paga al llegar al parque</div>
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

              {(errors.submit || compra_error) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit || compra_error}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between border-t pt-4 gap-2 px-2">
                <Button variant="outline" onClick={() => set_step(2)} disabled={is_loading} className="h-12 px-3 text-sm md:h-10 md:px-4 md:text-sm flex-1 max-w-[35%] md:flex-none md:max-w-none">
                  Atrás
                </Button>
                <Button 
                  onClick={handle_submit} 
                  disabled={is_loading}
                  className="bg-primary hover:bg-primary-dark h-12 px-3 text-sm md:h-10 md:px-4 md:text-sm flex-1 max-w-[60%] md:flex-none md:max-w-none"
                >
                  {is_loading ? "Procesando..." : "Confirmar Compra"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
