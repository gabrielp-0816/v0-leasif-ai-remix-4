"use client"

import { Button } from "@/components/ui/button"
import { Home, Building, FileText, User, MessageCircle } from "lucide-react"
import type { UserRole } from "@/types/user"

type Screen =
  | "splash"
  | "auth"
  | "dashboard"
  | "listings"
  | "property-details"
  | "feasibility"
  | "contracts"
  | "profile"
  | "chat"

interface BottomNavigationProps {
  currentScreen: Screen
  onNavigate: (screen: Screen) => void
  userRole: UserRole
  onLogout: () => void
}

export function BottomNavigation({ currentScreen, onNavigate, userRole }: BottomNavigationProps) {
  const landlordNavItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", screen: "dashboard" as Screen },
    { id: "listings", icon: Building, label: "Properties", screen: "listings" as Screen },
    { id: "chat", icon: MessageCircle, label: "Messages", screen: "chat" as Screen },
    { id: "contracts", icon: FileText, label: "Contracts", screen: "contracts" as Screen },
    { id: "profile", icon: User, label: "Profile", screen: "profile" as Screen },
  ]

  const tenantNavItems = [
    { id: "dashboard", icon: Home, label: "Discover", screen: "dashboard" as Screen },
    { id: "listings", icon: Building, label: "Browse", screen: "listings" as Screen },
    { id: "chat", icon: MessageCircle, label: "Messages", screen: "chat" as Screen },
    { id: "contracts", icon: FileText, label: "Contracts", screen: "contracts" as Screen },
    { id: "profile", icon: User, label: "Profile", screen: "profile" as Screen },
  ]

  const navItems = userRole === "landlord" ? landlordNavItems : tenantNavItems

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-card border-t border-border">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen
          const colorClass = userRole === "landlord" ? "text-accent" : "text-primary"

          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-2 ${
                isActive ? colorClass : "text-muted-foreground"
              }`}
              onClick={() => onNavigate(item.screen)}
            >
              <item.icon className={`h-5 w-5 ${isActive ? colorClass : "text-muted-foreground"}`} />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
