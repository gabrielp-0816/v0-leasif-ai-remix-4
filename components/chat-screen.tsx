"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Search, MessageCircle, Phone, MoreVertical, Trash2, Archive, ArchiveX } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { User } from "@/types/user"
import type { Conversation, ChatMessage } from "@/types/user"

interface ChatScreenProps {
  user: User
  onBack: () => void
}

export function ChatScreen({ user, onBack }: ChatScreenProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showArchived, setShowArchived] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [callActive, setCallActive] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isLandlord = user.role === "landlord"
  const accentColor = isLandlord ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"

  useEffect(() => {
    const mockConversations: Conversation[] = isLandlord
      ? [
          {
            id: "conv1",
            landlordId: user.id,
            landlordName: user.fullName,
            tenantId: "tenant1",
            tenantName: "Sarah Johnson",
            propertyId: "prop1",
            propertyName: "Modern Office Space",
            lastMessage: "When can I schedule a viewing?",
            lastMessageTime: new Date(Date.now() - 3600000),
            unreadCount: 2,
            tenantAvatar: "/professional-woman-avatar.png",
            isArchived: false,
          },
          {
            id: "conv2",
            landlordId: user.id,
            landlordName: user.fullName,
            tenantId: "tenant2",
            tenantName: "Michael Chen",
            propertyId: "prop2",
            propertyName: "Retail Storefront",
            lastMessage: "Thanks for the contract details!",
            lastMessageTime: new Date(Date.now() - 7200000),
            unreadCount: 0,
            tenantAvatar: "/professional-man-avatar.png",
            isArchived: false,
          },
        ]
      : [
          {
            id: "conv1",
            landlordId: "landlord1",
            landlordName: "John Property Owner",
            tenantId: user.id,
            tenantName: user.fullName,
            propertyId: "prop1",
            propertyName: "Modern Office Space",
            lastMessage: "The property is available next week",
            lastMessageTime: new Date(Date.now() - 3600000),
            unreadCount: 1,
            landlordAvatar: "/professional-man-avatar.png",
            isArchived: false,
          },
          {
            id: "conv2",
            landlordId: "landlord2",
            landlordName: "Emma Williams",
            tenantId: user.id,
            tenantName: user.fullName,
            propertyId: "prop3",
            propertyName: "Creative Studio",
            lastMessage: "I'll send over the lease agreement",
            lastMessageTime: new Date(Date.now() - 7200000),
            unreadCount: 0,
            landlordAvatar: "/professional-woman-avatar.png",
            isArchived: false,
          },
        ]

    setConversations(mockConversations)
  }, [user, isLandlord])

  // Load messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const mockMessages: ChatMessage[] = [
        {
          id: "msg1",
          conversationId: selectedConversation.id,
          senderId: isLandlord ? selectedConversation.tenantId : selectedConversation.landlordId,
          senderName: isLandlord ? selectedConversation.tenantName : selectedConversation.landlordName,
          senderRole: isLandlord ? "tenant" : "landlord",
          message: "Hi! I'm interested in the property.",
          timestamp: new Date(Date.now() - 86400000),
          read: true,
        },
        {
          id: "msg2",
          conversationId: selectedConversation.id,
          senderId: user.id,
          senderName: user.fullName,
          senderRole: user.role,
          message: "Great! I'd be happy to provide more details.",
          timestamp: new Date(Date.now() - 82800000),
          read: true,
        },
        {
          id: "msg3",
          conversationId: selectedConversation.id,
          senderId: isLandlord ? selectedConversation.tenantId : selectedConversation.landlordId,
          senderName: isLandlord ? selectedConversation.tenantName : selectedConversation.landlordName,
          senderRole: isLandlord ? "tenant" : "landlord",
          message: selectedConversation.lastMessage || "When can I schedule a viewing?",
          timestamp: selectedConversation.lastMessageTime || new Date(),
          read: false,
        },
      ]

      setMessages(mockMessages)
      scrollToBottom()
    }
  }, [selectedConversation, user, isLandlord])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: ChatMessage = {
      id: `msg${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: user.id,
      senderName: user.fullName,
      senderRole: user.role,
      message: newMessage,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
    scrollToBottom()
  }

  const handleDeleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId))
    setDeleteConfirm(null)
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null)
    }
  }

  const handleArchiveConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversationId ? { ...conv, isArchived: !conv.isArchived } : conv)),
    )
  }

  const handleInitiateCall = () => {
    setCallActive(true)
    setTimeout(() => {
      alert(`Call initiated with ${isLandlord ? selectedConversation?.tenantName : selectedConversation?.landlordName}`)
      setCallActive(false)
    }, 2000)
  }

  const filteredConversations = conversations
    .filter((conv) => conv.isArchived === showArchived)
    .filter((conv) => {
      const searchName = isLandlord ? conv.tenantName : conv.landlordName
      return (
        searchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.propertyName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

  if (selectedConversation) {
    const contactName = isLandlord ? selectedConversation.tenantName : selectedConversation.landlordName
    const contactAvatar = isLandlord ? selectedConversation.tenantAvatar : selectedConversation.landlordAvatar

    return (
      <div className="min-h-screen bg-background flex flex-col pb-20">
        <div className={`${accentColor} px-4 py-4 shadow-md`}>
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedConversation(null)} className="text-current">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleInitiateCall}
                disabled={callActive}
                className="text-current hover:bg-current/20"
              >
                <Phone className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-current hover:bg-current/20">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleArchiveConversation(selectedConversation.id)}>
                    {selectedConversation.isArchived ? (
                      <>
                        <ArchiveX className="h-4 w-4 mr-2" />
                        Unarchive
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteConfirm(selectedConversation.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contactAvatar || "/placeholder.svg"} alt={contactName} />
              <AvatarFallback>
                {contactName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold">{contactName}</h2>
              <p className="text-xs opacity-90">{selectedConversation.propertyName}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.senderId === user.id
              return (
                <div key={message.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] ${isOwnMessage ? "order-2" : "order-1"}`}>
                    <div className={`rounded-2xl px-4 py-2 ${isOwnMessage ? accentColor : "bg-muted text-foreground"}`}>
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-border p-4 bg-background">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage} className={accentColor}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </AlertDialogDescription>
            <div className="flex gap-2 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirm && handleDeleteConversation(deleteConfirm)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className={`${accentColor} px-4 py-6 shadow-md`}>
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-current">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="w-10" />
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/20 border-background/30 text-current placeholder:text-current/60"
          />
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowArchived(!showArchived)} className="w-full text-xs">
          {showArchived ? "Show Active" : "Show Archived"}
        </Button>
      </div>

      {/* Conversations List */}
      <div className="px-4 py-4 space-y-2">
        {filteredConversations.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">
              {showArchived ? "No archived conversations" : "No conversations yet"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isLandlord
                ? "When tenants message you about properties, they'll appear here"
                : "Start browsing properties and message landlords to begin conversations"}
            </p>
          </Card>
        ) : (
          filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage
                    src={isLandlord ? conversation.tenantAvatar : conversation.landlordAvatar}
                    alt={isLandlord ? conversation.tenantName : conversation.landlordName}
                  />
                  <AvatarFallback>
                    {(isLandlord ? conversation.tenantName : conversation.landlordName)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold truncate">
                      {isLandlord ? conversation.tenantName : conversation.landlordName}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {conversation.lastMessageTime &&
                        new Date(conversation.lastMessageTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{conversation.propertyName}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${accentColor}`}>
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this conversation? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteConversation(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
