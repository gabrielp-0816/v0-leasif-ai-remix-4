"use client"

import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
