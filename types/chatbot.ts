export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  requiresEscalation?: boolean
}

export interface ChatSession {
  id: string
  userId: string
  userRole: "tenant" | "landlord"
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  propertyContext?: {
    propertyId?: string
    propertyName?: string
    propertyType?: string
    rentAmount?: number
  }
}

export interface EscalationTicket {
  id: string
  userId: string
  userRole: "tenant" | "landlord"
  issue: string
  messages: ChatMessage[]
  status: "open" | "in-progress" | "resolved"
  createdAt: Date
  assignedTo?: string
}
