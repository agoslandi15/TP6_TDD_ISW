"use client"

import Image from "next/image"
import { use_auth } from "@/lib/auth_context"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export function Header() {
  const { user, logout } = use_auth()

  return (
    <header className="border-b border-border bg-card md:bg-card bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between md:justify-between flex-col md:flex-row gap-4 md:gap-0">
          {/* Logo y título - siempre arriba en móvil, izquierda en desktop */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
            <div className="flex h-16 w-16 md:h-24 md:w-24 items-center justify-center overflow-hidden">
              <Image
                src="/logoEcoHarmonyPark.jpg"
                alt="EcoHarmony Park logo"
                width={96}
                height={96}
                className="h-16 w-16 md:h-24 md:w-24 object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="font-display text-lg md:text-xl font-bold text-primary">EcoHarmony Park</h1>
              <p className="text-xs text-muted-foreground">Naturaleza y Diversión</p>
            </div>
          </div>

          {/* Usuario y logout - layout diferente para móvil vs desktop */}
          {user && (
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
              {/* Layout desktop: horizontal */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="gap-2 bg-transparent">
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>

              {/* Layout móvil: vertical (nombre arriba del botón) */}
              <div className="flex md:hidden flex-col items-center gap-2 w-full">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout} 
                  className="gap-2 bg-transparent w-auto px-4"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
