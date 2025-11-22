"use client"

import { useState } from "react"
import { AIChatbot } from "@/components/ai-chatbot"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"
import type { ChatMessage } from "@/types/chatbot"
import type { UserRole } from "@/types/user"

interface ChatbotWidgetProps {
  userId: string
  userRole: UserRole
  propertyContext?: {
    propertyId?: string
    propertyName?: string
    propertyType?: string
    rentAmount?: number
  }
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
}

export function ChatbotWidget({
  userId,
  userRole,
  propertyContext,
  isOpen: externalIsOpen,
  onToggle,
}: ChatbotWidgetProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [escalationTicket, setEscalationTicket] = useState<{
    issue: string
    messages: ChatMessage[]
  } | null>(null)

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen

  const handleToggle = (newState: boolean) => {
    if (onToggle) {
      onToggle(newState)
    } else {
      setInternalIsOpen(newState)
    }
  }

  const handleEscalation = (issue: string, messages: ChatMessage[]) => {
    setEscalationTicket({ issue, messages })
    console.log("Escalation ticket created:", { issue, messageCount: messages.length })
  }

  if (escalationTicket) {
    return (
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900 mb-1">Support Ticket Created</h4>
            <p className="text-sm text-amber-800 mb-3">
              Your issue has been escalated to our support team. They'll contact you shortly.
            </p>
            <p className="text-xs text-amber-700 mb-3">
              <strong>Issue:</strong> {escalationTicket.issue}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEscalationTicket(null)}
              className="text-amber-700 border-amber-200 hover:bg-amber-100"
            >
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div>
      <AIChatbot
        userId={userId}
        userRole={userRole}
        propertyContext={propertyContext}
        onEscalation={handleEscalation}
        compact={true}
        isOpen={isOpen}
        onToggle={handleToggle}
      />
    </div>
  )
}
