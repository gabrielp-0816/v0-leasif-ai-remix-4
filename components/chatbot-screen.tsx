"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AIChatbot } from "@/components/ai-chatbot"
import type { User } from "@/types/user"

interface ChatbotScreenProps {
  user: User
  onBack: () => void
}

export function ChatbotScreen({ user, onBack }: ChatbotScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-current">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">LeasifAI Assistant</h1>
          <p className="text-xs opacity-90">Your AI-powered lease management helper</p>
        </div>
      </div>

      {/* Chatbot */}
      <div className="flex-1 flex flex-col">
        <AIChatbot
          userId={user.id}
          userRole={user.role}
          propertyContext={{
            propertyName: user.role === "landlord" ? "Your Properties" : "Available Properties",
          }}
          compact={false}
        />
      </div>
    </div>
  )
}
