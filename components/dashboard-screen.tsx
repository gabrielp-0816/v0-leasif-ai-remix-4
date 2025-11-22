"use client"

import type { User } from "@/types/user"
import { LandlordDashboard } from "@/components/landlord-dashboard"
import { TenantDashboard } from "@/components/tenant-dashboard"

type Screen = "splash" | "auth" | "dashboard" | "listings" | "property-details" | "feasibility" | "contracts"

interface DashboardScreenProps {
  onNavigate: (screen: Screen, data?: any) => void
  user: User | null
}

export function DashboardScreen({ onNavigate, user }: DashboardScreenProps) {
  if (user?.role === "landlord") {
    return <LandlordDashboard onNavigate={onNavigate} user={user} />
  }

  return <TenantDashboard onNavigate={onNavigate} user={user} />
}
