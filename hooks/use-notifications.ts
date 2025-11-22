"use client"

import { useState, useEffect } from "react"
import type { Notification } from "@/types/notification"

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load notifications from localStorage
  useEffect(() => {
    if (!userId) return

    const savedNotifications = localStorage.getItem(`notifications_${userId}`)
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
        setNotifications(notificationsWithDates)
        updateUnreadCount(notificationsWithDates)
      } catch (error) {
        console.error("Error parsing notifications:", error)
      }
    } else {
      // Initialize with sample notifications
      initializeSampleNotifications(userId)
    }
  }, [userId])

  const initializeSampleNotifications = (userId: string) => {
    const sampleNotifications: Notification[] = [
      {
        id: "1",
        userId,
        type: "message",
        title: "New Message",
        message: "You have a new message from Sarah Johnson about the Downtown Office Space",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        metadata: { conversationId: "conv1" },
      },
      {
        id: "2",
        userId,
        type: "lease_request",
        title: "New Lease Request",
        message: "Michael Chen has submitted a lease request for Modern Retail Hub",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        metadata: { propertyId: "prop2" },
      },
      {
        id: "3",
        userId,
        type: "contract_update",
        title: "Contract Updated",
        message: "Your lease agreement for Tech Startup Office has been updated",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        metadata: { contractId: "contract1" },
      },
      {
        id: "4",
        userId,
        type: "feasibility_complete",
        title: "Feasibility Study Complete",
        message: "Your feasibility study for Coffee Shop - Downtown is ready to view",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        metadata: { propertyId: "prop3" },
      },
    ]

    setNotifications(sampleNotifications)
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(sampleNotifications))
    updateUnreadCount(sampleNotifications)
  }

  const updateUnreadCount = (notifs: Notification[]) => {
    const count = notifs.filter((n) => !n.read).length
    setUnreadCount(count)
  }

  const markAsRead = (notificationId: string) => {
    if (!userId) return

    const updated = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    setNotifications(updated)
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated))
    updateUnreadCount(updated)
  }

  const markAllAsRead = () => {
    if (!userId) return

    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated))
    updateUnreadCount(updated)
  }

  const deleteNotification = (notificationId: string) => {
    if (!userId) return

    const updated = notifications.filter((n) => n.id !== notificationId)
    setNotifications(updated)
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated))
    updateUnreadCount(updated)
  }

  const addNotification = (notification: Omit<Notification, "id" | "userId" | "timestamp" | "read">) => {
    if (!userId) return

    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      userId,
      timestamp: new Date(),
      read: false,
    }

    const updated = [newNotification, ...notifications]
    setNotifications(updated)
    localStorage.setItem(`notifications_${userId}`, JSON.stringify(updated))
    updateUnreadCount(updated)
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  }
}
