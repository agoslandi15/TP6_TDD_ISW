"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  is_loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, set_user] = useState<User | null>(null)
  const [is_loading, set_is_loading] = useState(true)

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("park_users") || "[]")
    if (users.length === 0) {
      const demo_user = {
        id: "demo-user-123",
        email: "demo@parque.com",
        password: "demo123",
        name: "Usuario Demo",
      }
      localStorage.setItem("park_users", JSON.stringify([demo_user]))
    }

    // Check if user is logged in on mount
    const stored_user = localStorage.getItem("park_user")
    if (stored_user) {
      set_user(JSON.parse(stored_user))
    }
    set_is_loading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validar que el email tenga formato válido
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email_regex.test(email)) {
      return false
    }

    // Aceptar cualquier contraseña que tenga al menos 1 carácter
    if (!password || password.length < 1) {
      return false
    }

    // Buscar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem("park_users") || "[]")
    let found_user = users.find((u: any) => u.email === email)

    // Si no existe, crear usuario automáticamente
    if (!found_user) {
      found_user = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        password: password, // Guardar cualquier contraseña
        name: email.split('@')[0], // Usar parte del email como nombre
      }
      users.push(found_user)
      localStorage.setItem("park_users", JSON.stringify(users))
    }

    // Loguear al usuario (sin validar contraseña específica)
    const user_data = { id: found_user.id, email: found_user.email, name: found_user.name }
    set_user(user_data)
    localStorage.setItem("park_user", JSON.stringify(user_data))
    return true
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    const users = JSON.parse(localStorage.getItem("park_users") || "[]")

    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      return false
    }

    const new_user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      name,
    }

    users.push(new_user)
    localStorage.setItem("park_users", JSON.stringify(users))

    const user_data = { id: new_user.id, email: new_user.email, name: new_user.name }
    set_user(user_data)
    localStorage.setItem("park_user", JSON.stringify(user_data))
    return true
  }

  const logout = () => {
    set_user(null)
    localStorage.removeItem("park_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, is_loading }}>{children}</AuthContext.Provider>
}

export function use_auth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("use_auth must be used within an AuthProvider")
  }
  return context
}
