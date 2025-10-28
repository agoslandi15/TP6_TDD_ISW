"use client"

import { use_auth } from "@/lib/auth_context"
import { Header } from "@/components/header"
import { LoginForm } from "@/components/login_form"
import { TicketPurchaseForm } from "@/components/ticket_purchase_form"

export default function Home() {
  const { user, is_loading } = use_auth()

  if (is_loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">{user ? <TicketPurchaseForm /> : <LoginForm />}</main>
    </div>
  )
}
