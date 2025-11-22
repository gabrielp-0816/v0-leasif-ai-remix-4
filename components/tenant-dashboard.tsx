"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileHeader } from "@/components/mobile-header"
import { useNotifications } from "@/hooks/use-notifications"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { Building, Heart, Search, MapPin, Clock, Eye, Star, Filter, Bookmark, X } from "lucide-react"
import type { User } from "@/types/user"

type Screen =
  | "splash"
  | "auth"
  | "dashboard"
  | "listings"
  | "property-details"
  | "feasibility"
  | "contracts"
  | "notifications"

interface TenantDashboardProps {
  onNavigate: (screen: Screen, data?: any) => void
  user: User | null
}

interface SavedProperty {
  id: string
  name: string
  location: string
  price: number
  rating: number
  image: string
  type: string
}

interface RecentSearch {
  id: string
  query: string
  location: string
  date: string
  resultCount: number
}

const mockSavedProperties: SavedProperty[] = [
  {
    id: "1",
    name: "Modern Office Space",
    location: "Downtown Business District",
    price: 8500,
    rating: 4.8,
    image: "/images/property-1.jpg",
    type: "Office",
  },
  {
    id: "2",
    name: "Retail Storefront",
    location: "Main Street Shopping Area",
    price: 6200,
    rating: 4.6,
    image: "/images/property-2.jpg",
    type: "Retail",
  },
  {
    id: "3",
    name: "Creative Studio Space",
    location: "Arts District",
    price: 4800,
    rating: 4.9,
    image: "/images/property-3.jpg",
    type: "Studio",
  },
]

const mockRecentSearches: RecentSearch[] = [
  {
    id: "1",
    query: "Office space 1000-2000 sqft",
    location: "Downtown",
    date: "2 days ago",
    resultCount: 12,
  },
  {
    id: "2",
    query: "Retail storefront",
    location: "Main Street",
    date: "1 week ago",
    resultCount: 8,
  },
  {
    id: "3",
    query: "Creative workspace",
    location: "Arts District",
    date: "2 weeks ago",
    resultCount: 15,
  },
]

export function TenantDashboard({ onNavigate, user }: TenantDashboardProps) {
  const { unreadCount } = useNotifications(user?.id)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    propertyType: [] as string[],
    priceRange: "all" as string,
    location: "" as string,
    rating: 0 as number,
  })

  const filteredProperties = mockSavedProperties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType =
      selectedFilters.propertyType.length === 0 || selectedFilters.propertyType.includes(property.type)

    const matchesPrice =
      selectedFilters.priceRange === "all" ||
      (selectedFilters.priceRange === "low" && property.price < 5000) ||
      (selectedFilters.priceRange === "medium" && property.price >= 5000 && property.price < 8000) ||
      (selectedFilters.priceRange === "high" && property.price >= 8000)

    const matchesLocation =
      selectedFilters.location === "" ||
      property.location.toLowerCase().includes(selectedFilters.location.toLowerCase())

    const matchesRating = selectedFilters.rating === 0 || property.rating >= selectedFilters.rating

    return matchesSearch && matchesType && matchesPrice && matchesLocation && matchesRating
  })

  const filteredSearches = mockRecentSearches.filter(
    (search) =>
      search.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      search.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFilterChange = (filterType: string, value: any) => {
    if (filterType === "propertyType") {
      setSelectedFilters((prev) => ({
        ...prev,
        propertyType: prev.propertyType.includes(value)
          ? prev.propertyType.filter((t) => t !== value)
          : [...prev.propertyType, value],
      }))
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }))
    }
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedFilters({
      propertyType: [],
      priceRange: "all",
      location: "",
      rating: 0,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader
        title="Discover Spaces"
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
          <h2 className="text-xl font-bold mb-2">Find your perfect space, {user?.fullName?.split(" ")[0]}!</h2>
          <p className="text-muted-foreground text-sm">
            Discover commercial properties tailored to your business needs
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for office, retail, warehouse..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowFilterModal(true)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Modal */}
        {showFilterModal && (
          <Card className="mb-6 border-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filters</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => setShowFilterModal(false)} className="p-0 h-auto">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* Property Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Property Type</label>
                <div className="space-y-2">
                  {["Office", "Retail", "Studio", "Warehouse"].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.propertyType.includes(type)}
                        onChange={() => handleFilterChange("propertyType", type)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price Range</label>
                <select
                  value={selectedFilters.priceRange}
                  onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Below ₱5,000/mo</option>
                  <option value="medium">₱5,000 - ₱8,000/mo</option>
                  <option value="high">Above ₱8,000/mo</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={selectedFilters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                <select
                  value={selectedFilters.rating}
                  onChange={(e) => handleFilterChange("rating", Number.parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.8}>4.8+ Stars</option>
                </select>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-2 pt-2">
                <Button onClick={resetFilters} variant="outline" className="flex-1 bg-transparent">
                  Reset
                </Button>
                <Button onClick={() => setShowFilterModal(false)} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={() => onNavigate("listings")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-12"
          >
            <Building className="h-4 w-4 mr-2" />
            Browse Properties
          </Button>
          <Button onClick={() => onNavigate("feasibility")} variant="outline" className="h-12">
            <Eye className="h-4 w-4 mr-2" />
            Feasibility Study
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="stat-card">
            <CardContent className="p-3">
              <div className="text-center">
                <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                <div className="text-lg font-bold">{mockSavedProperties.length}</div>
                <div className="text-xs text-muted-foreground">Saved</div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-3">
              <div className="text-center">
                <Search className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold">{mockRecentSearches.length}</div>
                <div className="text-xs text-muted-foreground">Searches</div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-3">
              <div className="text-center">
                <Eye className="h-5 w-5 text-accent mx-auto mb-1" />
                <div className="text-lg font-bold">24</div>
                <div className="text-xs text-muted-foreground">Viewed</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Properties */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Saved Properties{" "}
                {filteredProperties.length !== mockSavedProperties.length && `(${filteredProperties.length})`}
              </CardTitle>
              <Button variant="link" className="text-primary p-0 h-auto" onClick={() => onNavigate("saved-properties")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {filteredProperties.length > 0 ? (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{property.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {property.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate">{property.location}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-primary">
                          ₱{property.price.toLocaleString()}/mo
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-muted-foreground">{property.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent"
                        onClick={() => onNavigate("property-details", property)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs p-1">
                        <Heart className="h-3 w-3 text-red-500 fill-current" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">No properties match your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Searches */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Searches</CardTitle>
              <Button variant="link" className="text-primary p-0 h-auto">
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {filteredSearches.length > 0 ? (
              <div className="space-y-3">
                {filteredSearches.map((search) => (
                  <div key={search.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">{search.query}</span>
                        <Badge variant="outline" className="text-xs">
                          {search.resultCount} results
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{search.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{search.date}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <Search className="h-3 w-3 mr-1" />
                      Search Again
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">No searches match your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended for You */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recommended for You</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex-col gap-1 bg-transparent">
                <Building className="h-5 w-5" />
                <span className="text-xs">Office Spaces</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1 bg-transparent">
                <Bookmark className="h-5 w-5" />
                <span className="text-xs">Retail Locations</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {user && (
        <ChatbotWidget
          userId={user.id}
          userRole="tenant"
          propertyContext={{
            propertyName: "Available Properties",
          }}
          isOpen={isChatbotOpen}
          onToggle={setIsChatbotOpen}
        />
      )}
    </div>
  )
}
