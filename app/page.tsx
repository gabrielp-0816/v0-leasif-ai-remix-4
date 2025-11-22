"use client"

import React from "react"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { AuthScreen } from "@/components/auth-screen"
import { DashboardScreen } from "@/components/dashboard-screen"
import { PropertyListings } from "@/components/property-listings"
import { PropertyDetails } from "@/components/property-details"
import { FeasibilityStudy } from "@/components/feasibility-study"
import { LeaseApplication } from "@/components/lease-application"
import { ContractManagement } from "@/components/contract-management"
import { ProfileScreen } from "@/components/profile-screen"
import { ChatScreen } from "@/components/chat-screen"
import { NotificationsScreen } from "@/components/notifications-screen"
import { BottomNavigation } from "@/components/bottom-navigation"
import { LoadingScreen } from "@/components/loading-screen"
import { useAuthProvider } from "@/hooks/use-auth"
import type { UserRole } from "@/types/user"
import { ChatbotScreen } from "@/components/chatbot-screen"
import { SavedPropertiesView } from "@/components/saved-properties-view"

type Screen =
  | "splash"
  | "auth"
  | "dashboard"
  | "listings"
  | "property-details"
  | "feasibility"
  | "lease-application"
  | "contracts"
  | "profile"
  | "chat"
  | "notifications"
  | "chatbot"
  | "saved-properties"

export default function LeasifAIApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash")
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const auth = useAuthProvider()

  const navigateToScreen = (screen: Screen, data?: any) => {
    setIsLoading(true)

    // Simulate loading time for better UX
    setTimeout(() => {
      if (data) setSelectedProperty(data)
      setCurrentScreen(screen)
      setIsLoading(false)
    }, 300)
  }

  React.useEffect(() => {
    const handleNavigateToContracts = (event: any) => {
      navigateToScreen("contracts", event.detail)
    }
    window.addEventListener("navigateToContracts", handleNavigateToContracts)
    return () => window.removeEventListener("navigateToContracts", handleNavigateToContracts)
  }, [])

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role)
    navigateToScreen("auth")
  }

  const handleLogin = async (email: string, password: string, role: UserRole) => {
    await auth.login(email, password, role)
    navigateToScreen("dashboard")
  }

  const handleRegister = async (userData: any) => {
    await auth.register(userData)
    navigateToScreen("dashboard")
  }

  const handleLogout = () => {
    auth.logout()
    setSelectedRole(null)
    setCurrentScreen("splash")
  }

  // Show loading screen during transitions
  if (isLoading || auth.isLoading) {
    return <LoadingScreen message="Loading..." />
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <SplashScreen onSelectRole={handleRoleSelection} />
      case "auth":
        return (
          <AuthScreen
            onLogin={handleLogin}
            onRegister={handleRegister}
            onBack={() => navigateToScreen("splash")}
            userRole={selectedRole!}
            isLoading={auth.isLoading}
          />
        )
      case "dashboard":
        return <DashboardScreen onNavigate={navigateToScreen} user={auth.user} />
      case "listings":
        return (
          <PropertyListings
            onSelectProperty={(property) => navigateToScreen("property-details", property)}
            onBack={() => navigateToScreen("dashboard")}
            userRole={auth.user?.role || "tenant"}
          />
        )
      case "property-details":
        return (
          <PropertyDetails
            property={selectedProperty}
            onBack={() => navigateToScreen("listings")}
            onFeasibilityStudy={() => navigateToScreen("feasibility", selectedProperty)}
            onApplyForLease={(property) => navigateToScreen("lease-application", property)}
            userRole={auth.user?.role || "tenant"}
          />
        )
      case "feasibility":
        return (
          <FeasibilityStudy
            property={selectedProperty}
            onBack={() => navigateToScreen("property-details")}
            onApplyForLease={(property) => navigateToScreen("lease-application", property)}
          />
        )
      case "lease-application":
        return (
          <LeaseApplication
            property={selectedProperty}
            onBack={() => navigateToScreen("property-details")}
            onSubmit={() => navigateToScreen("contracts", { property: selectedProperty })}
          />
        )
      case "contracts":
        return (
          <ContractManagement
            onBack={() => navigateToScreen("dashboard")}
            userRole={auth.user?.role || "tenant"}
            newContractData={selectedProperty}
          />
        )
      case "saved-properties":
        return (
          <SavedPropertiesView
            onBack={() => navigateToScreen("dashboard")}
            onViewProperty={(property) => navigateToScreen("property-details", property)}
          />
        )
      case "profile":
        return (
          <ProfileScreen
            user={auth.user!}
            onBack={() => navigateToScreen("dashboard")}
            onUpdateProfile={auth.updateProfile}
            onLogout={handleLogout}
          />
        )
      case "chat":
        return <ChatScreen user={auth.user!} onBack={() => navigateToScreen("dashboard")} />
      case "chatbot":
        return <ChatbotScreen user={auth.user!} onBack={() => navigateToScreen("dashboard")} />
      case "notifications":
        return (
          <NotificationsScreen
            userId={auth.user?.id || ""}
            onBack={() => navigateToScreen("dashboard")}
            onNavigate={navigateToScreen}
          />
        )
      default:
        return <SplashScreen onSelectRole={handleRoleSelection} />
    }
  }

  const showBottomNav = auth.isAuthenticated && !["splash", "auth"].includes(currentScreen)

  return (
    <div className="relative">
      {renderScreen()}
      {showBottomNav && (
        <BottomNavigation
          currentScreen={currentScreen}
          onNavigate={navigateToScreen}
          userRole={auth.user?.role || "tenant"}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}
