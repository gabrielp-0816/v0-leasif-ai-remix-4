import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant"
    content: string
  }>
  userRole: "tenant" | "landlord"
  propertyContext?: {
    propertyName?: string
    propertyType?: string
    rentAmount?: number
  }
}

// System prompts tailored for different user roles
const getSystemPrompt = (userRole: "tenant" | "landlord") => {
  const basePrompt = `You are LeasifAI Assistant, an intelligent chatbot designed to help users with lease management and commercial real estate. You are helpful, professional, and knowledgeable about leasing processes.

Key responsibilities:
- Answer questions about lease agreements, terms, and conditions
- Help users navigate the LeasifAI platform features
- Provide guidance on property viewing, contract management, and maintenance issues
- Offer personalized advice based on user role and context
- Maintain a professional and friendly tone
- Be concise and clear in your responses

When you encounter complex issues that require human intervention (legal disputes, contract negotiations, emergency maintenance), clearly indicate that the user should escalate to human support.`

  if (userRole === "tenant") {
    return (
      basePrompt +
      `

You are assisting a TENANT. Focus on:
- Lease terms and tenant rights
- Maintenance request procedures
- Payment and billing questions
- Move-in/move-out processes
- Property amenities and features
- Dispute resolution procedures`
    )
  } else {
    return (
      basePrompt +
      `

You are assisting a LANDLORD/PROPERTY MANAGER. Focus on:
- Tenant management and communication
- Lease agreement customization
- Property maintenance coordination
- Revenue and financial tracking
- Tenant screening and verification
- Legal compliance and regulations`
    )
  }
}

// Detect if a message requires escalation to human support
const shouldEscalate = (message: string): boolean => {
  const escalationKeywords = [
    "legal",
    "lawsuit",
    "dispute",
    "emergency",
    "urgent",
    "critical",
    "breach",
    "violation",
    "eviction",
    "contract negotiation",
    "complex",
    "human support",
    "speak to someone",
    "agent",
  ]

  const lowerMessage = message.toLowerCase()
  return escalationKeywords.some((keyword) => lowerMessage.includes(keyword))
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, userRole, propertyContext } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 })
    }

    // Check if escalation is needed
    const lastUserMessage = messages[messages.length - 1]?.content || ""
    const needsEscalation = shouldEscalate(lastUserMessage)

    if (needsEscalation) {
      return NextResponse.json({
        response: `I understand this is an important matter. Based on the nature of your question, I recommend connecting with our human support team who can provide specialized assistance. They'll be able to help you with complex issues like this. Would you like me to escalate your case?`,
        requiresEscalation: true,
        escalationReason: "Complex issue detected",
      })
    }

    // Generate AI response using Vercel AI SDK
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: getSystemPrompt(userRole),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxTokens: 500,
    })

    return NextResponse.json({
      response: text,
      requiresEscalation: false,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
