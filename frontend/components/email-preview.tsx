"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

interface EmailPreviewProps {
  content: string
}

export function EmailPreview({ content }: EmailPreviewProps) {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="h-5 w-5 text-primary" />
          Email de Confirmación Enviado
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-lg bg-muted p-4">
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground">{content}</pre>
        </div>
      </CardContent>
    </Card>
  )
}
