"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileHeader } from "@/components/mobile-header"
import { useNotifications } from "@/hooks/use-notifications"
import { Building, DollarSign, Users, Calendar, Eye, Plus, Star, MessageSquare, BarChart3 } from "lucide-react"
import type { User } from "@/types/user"
import { ChatbotWidget } from "@/components/chatbot-widget"

type Screen =
  | "splash"
  | "auth"
  | "dashboard"
  | "listings"
  | "property-details"
  | "feasibility"
  | "contracts"
  | "notifications"

interface LandlordDashboardProps {
  onNavigate: (screen: Screen, data?: any) => void
  user: User | null
}

interface PropertyStats {
  totalProperties: number
  occupiedProperties: number
  monthlyRevenue: number
  averageRating: number
  totalTenants: number
}

interface RecentActivity {
  id: string
  type: "booking" | "review" | "inquiry" | "payment"
  title: string
  description: string
  time: string
  amount?: number
}

interface PropertyPerformance {
  id: string
  name: string
  occupancyRate: number
  monthlyRevenue: number
  rating: number
  reviewCount: number
  image: string
}

const mockStats: PropertyStats = {
  totalProperties: 8,
  occupiedProperties: 6,
  monthlyRevenue: 45000,
  averageRating: 4.8,
  totalTenants: 12,
}

const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "booking",
    title: "New Lease Agreement",
    description: "Tech Solutions Inc. signed 2-year lease",
    time: "2 hours ago",
    amount: 8500,
  },
  {
    id: "2",
    type: "review",
    title: "New Review Received",
    description: "5-star review from Creative Agency Co.",
    time: "5 hours ago",
  },
  {
    id: "3",
    type: "inquiry",
    title: "Property Inquiry",
    description: "Startup Hub interested in downtown office",
    time: "1 day ago",
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Received",
    description: "Monthly rent from Retail Store LLC",
    time: "2 days ago",
    amount: 6200,
  },
]

const mockPropertyPerformance: PropertyPerformance[] = [
  {
    id: "1",
    name: "Downtown Office Complex",
    occupancyRate: 95,
    monthlyRevenue: 15000,
    rating: 4.9,
    reviewCount: 24,
    image: "/images/property-1.jpg",
  },
  {
    id: "2",
    name: "Retail Space Main Street",
    occupancyRate: 100,
    monthlyRevenue: 12000,
    rating: 4.7,
    reviewCount: 18,
    image: "/images/property-2.jpg",
  },
  {
    id: "3",
    name: "Creative District Studio",
    occupancyRate: 80,
    monthlyRevenue: 8500,
    rating: 4.8,
    reviewCount: 15,
    image: "/images/property-3.jpg",
  },
]

export function LandlordDashboard({ onNavigate, user }: LandlordDashboardProps) {
  const { unreadCount } = useNotifications(user?.id)
  const occupancyRate = Math.round((mockStats.occupiedProperties / mockStats.totalProperties) * 100)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [showAllActivity, setShowAllActivity] = useState(false)
  const [showAllProperties, setShowAllProperties] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader
        title="Host Dashboard"
        showNotifications
        showProfile
        showLogo
        showChatbot
        notificationCount={unreadCount}
        onNotificationsClick={() => onNavigate("notifications")}
        onProfileClick={() => onNavigate("profile")}
        onChatbotClick={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      <div className="mobile-content">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Welcome back, {user?.fullName?.split(" ")[0]}!</h2>
          <p className="text-muted-foreground text-sm">Here's how your properties are performing</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card
            className="stat-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate("contracts")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="h-5 w-5 text-accent" />
                <span className="text-xs text-muted-foreground">This month</span>
              </div>
              <div className="text-2xl font-bold text-accent">₱{mockStats.monthlyRevenue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Monthly Revenue</div>
            </CardContent>
          </Card>

          <Card
            className="stat-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate("listings")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Building className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">{occupancyRate}%</span>
              </div>
              <div className="text-2xl font-bold">
                {mockStats.occupiedProperties}/{mockStats.totalProperties}
              </div>
              <div className="text-xs text-muted-foreground">Properties Occupied</div>
            </CardContent>
          </Card>

          <Card
            className="stat-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate("listings")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-xs text-muted-foreground">Rating</span>
              </div>
              <div className="text-2xl font-bold">{mockStats.averageRating}</div>
              <div className="text-xs text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>

          <Card
            className="stat-card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate("contracts")}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
              <div className="text-2xl font-bold">{mockStats.totalTenants}</div>
              <div className="text-xs text-muted-foreground">Total Tenants</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button onClick={() => onNavigate("listings")} className="bg-accent hover:bg-accent/90 text-white h-12">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
          <Button onClick={() => onNavigate("contracts")} variant="outline" className="h-12">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>

        {/* Property Performance */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Property Performance</CardTitle>
              <Button
                variant="link"
                className="text-accent p-0 h-auto"
                onClick={() => setShowAllProperties(!showAllProperties)}
              >
                {showAllProperties ? "Show Less" : "View All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {(showAllProperties ? mockPropertyPerformance : mockPropertyPerformance.slice(0, 2)).map((property) => (
                <div key={property.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Building className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{property.name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-muted-foreground">{property.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs text-muted-foreground">
                        ₱{property.monthlyRevenue.toLocaleString()}/mo
                      </span>
                      <span className="text-xs text-muted-foreground">{property.reviewCount} reviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                      
                      
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-transparent"
                    onClick={() => onNavigate("property-details", { propertyId: property.id })}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button
                variant="link"
                className="text-accent p-0 h-auto"
                onClick={() => setShowAllActivity(!showAllActivity)}
              >
                {showAllActivity ? "Show Less" : "View All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {(showAllActivity ? mockRecentActivity : mockRecentActivity.slice(0, 2)).map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    {activity.type === "booking" && <Calendar className="h-5 w-5 text-accent" />}
                    {activity.type === "review" && <Star className="h-5 w-5 text-yellow-500" />}
                    {activity.type === "inquiry" && <MessageSquare className="h-5 w-5 text-primary" />}
                    {activity.type === "payment" && <DollarSign className="h-5 w-5 text-green-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{activity.title}</span>
                      {activity.amount && (
                        <Badge variant="secondary" className="text-xs">
                          +₱{activity.amount.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {user && (
        <ChatbotWidget
          userId={user.id}
          userRole="landlord"
          propertyContext={{
            propertyName: "Your Properties",
          }}
          isOpen={isChatbotOpen}
          onToggle={setIsChatbotOpen}
        />
      )}
    </div>
  )
}
