"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, AlertCircle, Loader2, X, Sparkles } from "lucide-react"
import type { ChatMessage, ChatSession } from "@/types/chatbot"
import type { UserRole } from "@/types/user"

interface AIChatbotProps {
  userId: string
  userRole: UserRole
  propertyContext?: {
    propertyId?: string
    propertyName?: string
    propertyType?: string
    rentAmount?: number
  }
  onEscalation?: (issue: string, messages: ChatMessage[]) => void
  compact?: boolean
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
}

export function AIChatbot({
  userId,
  userRole,
  propertyContext,
  onEscalation,
  compact = false,
  isOpen: externalIsOpen,
  onToggle,
}: AIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [internalIsOpen, setInternalIsOpen] = useState(!compact)
  const [sessionId] = useState(() => `session-${Date.now()}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen

  const handleToggle = (newState: boolean) => {
    if (onToggle) {
      onToggle(newState)
    } else {
      setInternalIsOpen(newState)
    }
  }

  // Load chat history from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem(`chatbot-session-${userId}`)
    if (savedSession) {
      try {
        const session: ChatSession = JSON.parse(savedSession)
        setMessages(session.messages)
      } catch (error) {
        console.error("Error loading chat history:", error)
      }
    }
  }, [userId])

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Save chat session to localStorage
  const saveSession = useCallback(
    (updatedMessages: ChatMessage[]) => {
      const session: ChatSession = {
        id: sessionId,
        userId,
        userRole,
        messages: updatedMessages,
        createdAt: new Date(),
        updatedAt: new Date(),
        propertyContext,
      }
      localStorage.setItem(`chatbot-session-${userId}`, JSON.stringify(session))
    },
    [sessionId, userId, userRole, propertyContext],
  )

  // Send message to AI
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputValue("")
    setIsLoading(true)

    try {
      // Call AI API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          userRole,
          propertyContext,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        requiresEscalation: data.requiresEscalation,
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      setMessages(finalMessages)
      saveSession(finalMessages)

      // Handle escalation
      if (data.requiresEscalation && onEscalation) {
        onEscalation(inputValue, finalMessages)
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again or contact support.",
        timestamp: new Date(),
      }
      const finalMessages = [...updatedMessages, errorMessage]
      setMessages(finalMessages)
      saveSession(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }

  // Clear chat history
  const handleClearChat = () => {
    setMessages([])
    localStorage.removeItem(`chatbot-session-${userId}`)
  }

  if (compact && !isOpen) {
    return (
      <Button
        onClick={() => handleToggle(true)}
        className="fixed bottom-24 right-4 rounded-full w-14 h-14 shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        size="icon"
      >
        <Sparkles className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`flex flex-col bg-gradient-to-b from-background to-background/95 border border-primary/20 ${
        compact ? "fixed bottom-24 right-4 w-96 h-[600px] shadow-2xl rounded-2xl" : "w-full h-full"
      }`}
    >
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground p-4 rounded-t-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/20 rounded-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">LeasifAI Assistant</h3>
            <p className="text-xs opacity-85">Powered by AI</p>
          </div>
        </div>
        {compact && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleToggle(false)}
            className="text-current hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground mb-2">Welcome to LeasifAI Assistant!</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {userRole === "tenant"
                  ? "Ask me about lease terms, maintenance, property features, or platform help."
                  : "Ask me about tenant management, property optimization, lease agreements, or platform features."}
              </p>
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground font-medium mb-3">Quick questions:</p>
                <div className="space-y-2">
                  <button className="w-full text-left text-xs p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-foreground">
                    How do I renew my lease?
                  </button>
                  <button className="w-full text-left text-xs p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-foreground">
                    What are maintenance procedures?
                  </button>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md"
                        : "bg-muted/80 text-foreground border border-border/50 backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    {message.requiresEscalation && (
                      <div className="flex items-center gap-1 mt-2 text-xs opacity-75 pt-2 border-t border-current/20">
                        <AlertCircle className="h-3 w-3" />
                        <span>Escalation recommended</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted/80 rounded-xl px-4 py-3 flex items-center gap-2 border border-border/50">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border/50 p-4 space-y-2 bg-background/50 rounded-b-2xl">
        {messages.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="w-full text-xs bg-transparent hover:bg-muted/50"
          >
            Clear Chat
          </Button>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
            disabled={isLoading}
            className="text-sm bg-background/80 border-border/50 focus:border-primary/50"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="flex-shrink-0 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
