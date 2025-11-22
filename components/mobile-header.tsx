"use client"

import { ArrowLeft, Bell, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppIcon } from "./app-icon"

interface MobileHeaderProps {
  title: string
  showBack?: boolean
  showNotifications?: boolean
  showProfile?: boolean
  showLogo?: boolean
  showChatbot?: boolean
  notificationCount?: number
  onBack?: () => void
  onNotificationsClick?: () => void
  onProfileClick?: () => void
  onChatbotClick?: () => void
}

export function MobileHeader({
  title,
  showBack = false,
  showNotifications = false,
  showProfile = false,
  showLogo = false,
  showChatbot = false,
  notificationCount = 0,
  onBack,
  onNotificationsClick,
  onProfileClick,
  onChatbotClick,
}: MobileHeaderProps) {
  return (
    <div className="mobile-header">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="text-primary-foreground hover:bg-primary/80">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        {showLogo && <AppIcon size={32} />}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {showChatbot && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onChatbotClick}
            className="text-primary-foreground hover:bg-primary/80"
            title="Open AI Chatbot"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
        )}
        {showNotifications && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onNotificationsClick}
            className="text-primary-foreground hover:bg-primary/80 relative"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
                {notificationCount > 9 ? "9+" : notificationCount}
              </Badge>
            )}
          </Button>
        )}
        {showProfile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onProfileClick}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <User className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
