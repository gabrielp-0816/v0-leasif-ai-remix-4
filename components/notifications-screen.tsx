"use client"

import { Bell, MessageSquare, FileText, DollarSign, Home, BarChart3, Info, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileHeader } from "./mobile-header"
import { useNotifications } from "@/hooks/use-notifications"
import type { NotificationType } from "@/types/notification"

interface NotificationsScreenProps {
  userId: string
  onBack: () => void
  onNavigate?: (screen: string, data?: any) => void
}

const notificationIcons: Record<NotificationType, any> = {
  message: MessageSquare,
  lease_request: FileText,
  contract_update: FileText,
  payment_due: DollarSign,
  property_update: Home,
  feasibility_complete: BarChart3,
  system: Info,
}

const notificationColors: Record<NotificationType, string> = {
  message: "text-blue-500",
  lease_request: "text-green-500",
  contract_update: "text-orange-500",
  payment_due: "text-red-500",
  property_update: "text-purple-500",
  feasibility_complete: "text-cyan-500",
  system: "text-gray-500",
}

export function NotificationsScreen({ userId, onBack, onNavigate }: NotificationsScreenProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications(userId)

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (onNavigate) {
      // Navigate based on notification type
      switch (notification.type) {
        case "lease_request":
          onNavigate("contracts")
          break
        case "contract_update":
          onNavigate("contracts")
          break
        case "message":
          onNavigate("chat")
          break
        case "property_update":
          onNavigate("listings")
          break
        case "feasibility_complete":
          onNavigate("feasibility")
          break
        case "payment_due":
          onNavigate("contracts")
          break
        default:
          break
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Notifications" showBack onBack={onBack} />

      <div className="mobile-content">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{unreadCount > 0 ? `${unreadCount} Unread` : "All caught up!"}</h2>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-primary">
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground mt-1">We'll notify you when something important happens</p>
            </Card>
          ) : (
            notifications.map((notification) => {
              const Icon = notificationIcons[notification.type]
              const iconColor = notificationColors[notification.type]

              return (
                <Card
                  key={notification.id}
                  className={`p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                    !notification.read ? "bg-primary/5 border-primary/20" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className={`flex-shrink-0 ${iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{notification.title}</h3>
                        {!notification.read && <Badge className="bg-primary text-xs px-1.5 py-0">New</Badge>}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{formatTimestamp(notification.timestamp)}</span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="h-7 px-2 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
