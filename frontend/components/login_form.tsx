"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { use_auth } from "@/lib/auth_context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trees, Sparkles } from "lucide-react"

export function LoginForm() {
  const { login, register } = use_auth()
  const [is_login, set_is_login] = useState(true)
  const [email, set_email] = useState("")
  const [password, set_password] = useState("")
  const [name, set_name] = useState("")
  const [error, set_error] = useState("")
  const [is_loading, set_is_loading] = useState(false)

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault()
    set_error("")
    set_is_loading(true)

    try {
      let success = false
      if (is_login) {
        success = await login(email, password)
        if (!success) {
          set_error("Por favor ingresa un email válido")
        }
      } else {
        if (!name.trim()) {
          set_error("Por favor ingresa tu nombre")
          set_is_loading(false)
          return
        }
        success = await register(email, password, name)
        if (!success) {
          set_error("El email ya está registrado")
        }
      }
    } catch (err) {
      set_error("Ocurrió un error. Por favor intenta nuevamente.")
    } finally {
      set_is_loading(false)
    }
  }

  const fill_demo_credentials = () => {
    set_email("demo@parque.com")
    set_password("123")
    set_is_login(true)
  }

  return (
    <div className="relative flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="absolute left-[10%] top-[15%] animate-float opacity-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 md:h-12 md:w-12 text-primary">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
        </svg>
      </div>
      <div className="absolute right-[15%] top-[25%] animate-float-delayed opacity-20">
        <Trees className="h-16 w-16 text-accent" />
      </div>
      <div className="absolute left-[20%] bottom-[20%] animate-float opacity-20">
        <Sparkles className="h-10 w-10 text-secondary" />
      </div>

      <Card className="relative w-full max-w-md shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full overflow-hidden">
            <Image
              src="/logoEcoHarmonyPark.jpg"
              alt="EcoHarmony Park logo"
              width={224}
              height={224}
              className="h-56 w-56 object-contain"
              priority
            />
          </div>
          <div>
            <CardTitle className="font-display text-3xl font-bold text-balance">
              {is_login ? "Bienvenido de Nuevo" : "Únete a la Aventura"}
            </CardTitle>
            <CardDescription className="text-base text-pretty">
              {is_login
                ? "Ingresa tus credenciales para comprar entradas al parque"
                : "Crea tu cuenta y comienza a explorar la naturaleza"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handle_submit} className="space-y-4">
            {!is_login && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nombre y apellido"
                  value={name}
                  onChange={(e) => set_name(e.target.value)}
                  required={!is_login}
                  className="h-11"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email (para recibir confirmación)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => set_email(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => set_password(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {is_login && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/5 bg-transparent"
                onClick={fill_demo_credentials}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Rellenar ejemplo rápido
              </Button>
            )}

            <Button
              type="submit"
              className="h-11 w-full bg-gradient-to-r from-primary to-accent font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              disabled={is_loading}
            >
              {is_loading ? "Procesando..." : is_login ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  set_is_login(!is_login)
                  set_error("")
                  set_email("")
                  set_password("")
                  set_name("")
                }}
                className="font-medium text-primary hover:underline"
              >
                {is_login ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </form>

          {is_login && (
            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-center text-sm text-muted-foreground">
                <strong className="text-foreground">Instrucciones:</strong>
                <br />
                📧 <strong>Email:</strong> Ingresa tu email real(recibirás la confirmación aquí)
                <br />
                🔐 <strong>Contraseña:</strong> Ingrese tu contraseña
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
