"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Trees, Sparkles } from "lucide-react"

export function LoginForm() {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      let success = false
      if (isLogin) {
        success = await login(email, password)
        if (!success) {
          setError("Credenciales inválidas")
        }
      } else {
        if (!name.trim()) {
          setError("Por favor ingresa tu nombre")
          setIsLoading(false)
          return
        }
        success = await register(email, password, name)
        if (!success) {
          setError("El email ya está registrado")
        }
      }
    } catch (err) {
      setError("Ocurrió un error. Por favor intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setEmail("demo@parque.com")
    setPassword("demo123")
    setIsLogin(true)
  }

  return (
    <div className="relative flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="absolute left-[10%] top-[15%] animate-float opacity-20">
        <Leaf className="h-12 w-12 text-primary" />
      </div>
      <div className="absolute right-[15%] top-[25%] animate-float-delayed opacity-20">
        <Trees className="h-16 w-16 text-accent" />
      </div>
      <div className="absolute left-[20%] bottom-[20%] animate-float opacity-20">
        <Sparkles className="h-10 w-10 text-secondary" />
      </div>

      <Card className="relative w-full max-w-md shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
            <Leaf className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="font-display text-3xl font-bold text-balance">
              {isLogin ? "Bienvenido de Nuevo" : "Únete a la Aventura"}
            </CardTitle>
            <CardDescription className="text-base text-pretty">
              {isLogin
                ? "Ingresa tus credenciales para comprar entradas al parque"
                : "Crea tu cuenta y comienza a explorar la naturaleza"}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="h-11"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLogin && (
              <Button
                type="button"
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/5 bg-transparent"
                onClick={fillDemoCredentials}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Usar credenciales de prueba
              </Button>
            )}

            <Button
              type="submit"
              className="h-11 w-full bg-gradient-to-r from-primary to-accent font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError("")
                  setEmail("")
                  setPassword("")
                  setName("")
                }}
                className="font-medium text-primary hover:underline"
              >
                {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            </div>
          </form>

          {isLogin && (
            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-center text-sm text-muted-foreground">
                <strong className="text-foreground">Credenciales de prueba:</strong>
                <br />
                Email: <code className="rounded bg-background px-2 py-1">demo@parque.com</code>
                <br />
                Contraseña: <code className="rounded bg-background px-2 py-1">demo123</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
