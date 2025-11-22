"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MobileHeader } from "@/components/mobile-header"
import { LandlordPropertyListings } from "@/components/landlord-property-listings"
import { MapPin, Star, Building, Search, DollarSign, Maximize, Heart } from "lucide-react"
import Image from "next/image"
import type { UserRole } from "@/types/user"
import type { User } from "@/types/user"

interface Property {
  id: string
  title: string
  location: string
  price: string
  priceUnit: string
  image: string
  rating: number
  type: string
  size: string
  features: string[]
  photos?: string[]
  landlord?: {
    name: string
    phone: string
    email: string
  }
}

interface PropertyListingsProps {
  onSelectProperty: (property: Property) => void
  onBack: () => void
  userRole: UserRole
  user?: User | null
  onSaveProperty?: (property: Property) => void
}

// Mock data for tenant property browsing
const mockTenantProperties: Property[] = [
  {
    id: "1",
    title: "Modern Office Space",
    location: "Downtown Business District",
    price: "₱10,350",
    priceUnit: "month",
    image: "/modern-office.png",
    rating: 4.8,
    type: "Office",
    size: "1,200 sq ft",
    features: ["Parking", "WiFi", "Security", "AC"],
    photos: ["/modern-office.png", "/modern-office-interior.png", "/office-exterior.jpg"],
    landlord: {
      name: "John Smith",
      phone: "+63 917 123 4567",
      email: "john.smith@realestate.com",
    },
  },
  {
    id: "2",
    title: "Retail Store Front",
    location: "Main Street Shopping Area",
    price: "₱8,500",
    priceUnit: "month",
    image: "/retail-storefront.jpg",
    rating: 4.6,
    type: "Retail",
    size: "800 sq ft",
    features: ["Ground Floor", "High Traffic", "Storage"],
    photos: ["/retail-storefront.jpg", "/retail-interior.jpg", "/retail-storefront.jpg"],
    landlord: {
      name: "Maria Garcia",
      phone: "+63 917 234 5678",
      email: "maria.garcia@realestate.com",
    },
  },
  {
    id: "3",
    title: "Creative Studio Space",
    location: "Arts District",
    price: "₱6,200",
    priceUnit: "month",
    image: "/creative-studio-space.jpg",
    rating: 4.9,
    type: "Studio",
    size: "1,500 sq ft",
    features: ["High Ceilings", "Natural Light", "Flexible"],
    photos: ["/creative-studio-space.jpg", "/studio-interior.jpg", "/studio-space.jpg"],
    landlord: {
      name: "Alex Chen",
      phone: "+63 917 345 6789",
      email: "alex.chen@realestate.com",
    },
  },
  {
    id: "4",
    title: "Restaurant Space",
    location: "Food District",
    price: "₱12,000",
    priceUnit: "month",
    image: "/restaurant-space.jpg",
    rating: 4.7,
    type: "Restaurant",
    size: "2,000 sq ft",
    features: ["Kitchen Ready", "Outdoor Seating", "Licensed"],
    photos: ["/restaurant-space.jpg", "/modern-restaurant-interior.png", "/restaurant-dining.jpg"],
    landlord: {
      name: "Rosa Santos",
      phone: "+63 917 456 7890",
      email: "rosa.santos@realestate.com",
    },
  },
  {
    id: "5",
    title: "Warehouse Space",
    location: "Industrial Zone",
    price: "₱15,500",
    priceUnit: "month",
    image: "/warehouse-space.jpg",
    rating: 4.5,
    type: "Warehouse",
    size: "5,000 sq ft",
    features: ["Loading Dock", "High Ceiling", "Security"],
    photos: ["/warehouse-space.jpg", "/warehouse-interior.png", "/warehouse-exterior.jpg"],
    landlord: {
      name: "David Lee",
      phone: "+63 917 567 8901",
      email: "david.lee@realestate.com",
    },
  },
  {
    id: "6",
    title: "Co-working Space",
    location: "Tech Hub",
    price: "₱4,800",
    priceUnit: "month",
    image: "/modern-coworking-space.png",
    rating: 4.8,
    type: "Co-working",
    size: "600 sq ft",
    features: ["Shared Amenities", "Networking", "Flexible"],
    photos: ["/modern-coworking-space.png", "/modern-coworking-space.png", "/coworking-office.jpg"],
    landlord: {
      name: "Emma Wilson",
      phone: "+63 917 678 9012",
      email: "emma.wilson@realestate.com",
    },
  },
  {
    id: "7",
    title: "Medical Clinic Space",
    location: "Healthcare District",
    price: "₱9,200",
    priceUnit: "month",
    image: "/medical-clinic.jpg",
    rating: 4.7,
    type: "Healthcare",
    size: "1,100 sq ft",
    features: ["Waiting Area", "Private Rooms", "Accessible"],
    photos: ["/medical-clinic.jpg", "/clinic-interior.jpg", "/clinic-exterior.jpg"],
    landlord: {
      name: "Dr. Patricia Reyes",
      phone: "+63 917 789 0123",
      email: "patricia.reyes@realestate.com",
    },
  },
  {
    id: "8",
    title: "Educational Training Center",
    location: "Education Hub",
    price: "₱7,500",
    priceUnit: "month",
    image: "/training-center.jpg",
    rating: 4.6,
    type: "Education",
    size: "1,800 sq ft",
    features: ["Classrooms", "Projectors", "Breakout Rooms"],
    photos: ["/training-center.jpg", "/classroom-interior.jpg", "/training-exterior.jpg"],
    landlord: {
      name: "Michael Torres",
      phone: "+63 917 890 1234",
      email: "michael.torres@realestate.com",
    },
  },
  {
    id: "9",
    title: "Manufacturing Workshop",
    location: "Industrial Park",
    price: "₱18,000",
    priceUnit: "month",
    image: "/manufacturing-workshop.jpg",
    rating: 4.4,
    type: "Manufacturing",
    size: "3,500 sq ft",
    features: ["Heavy Equipment", "Power Supply", "Ventilation"],
    photos: ["/manufacturing-workshop.jpg", "/workshop-interior.jpg", "/workshop-exterior.jpg"],
    landlord: {
      name: "Carlos Mendoza",
      phone: "+63 917 901 2345",
      email: "carlos.mendoza@realestate.com",
    },
  },
  {
    id: "10",
    title: "Logistics Distribution Center",
    location: "Port Area",
    price: "₱22,000",
    priceUnit: "month",
    image: "/logistics-center.jpg",
    rating: 4.5,
    type: "Logistics",
    size: "6,000 sq ft",
    features: ["Loading Bays", "Climate Control", "Security"],
    photos: ["/logistics-center.jpg", "/logistics-interior.jpg", "/logistics-exterior.jpg"],
    landlord: {
      name: "Antonio Fernandez",
      phone: "+63 917 012 3456",
      email: "antonio.fernandez@realestate.com",
    },
  },
]

export function PropertyListings({ onSelectProperty, onBack, userRole, user, onSaveProperty }: PropertyListingsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set())

  if (userRole === "landlord") {
    return <LandlordPropertyListings onBack={onBack} user={user || null} />
  }

  const filteredProperties = mockTenantProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || property.type.toLowerCase() === selectedType.toLowerCase()
    return matchesSearch && matchesType
  })

  const propertyTypes = [
    "all",
    "office",
    "retail",
    "studio",
    "restaurant",
    "warehouse",
    "co-working",
    "healthcare",
    "education",
    "manufacturing",
    "logistics",
  ]

  const handleLikeProperty = (property: Property) => {
    const newLiked = new Set(likedProperties)
    if (newLiked.has(property.id)) {
      newLiked.delete(property.id)
    } else {
      newLiked.add(property.id)
    }
    setLikedProperties(newLiked)
    onSaveProperty?.(property)
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Browse Properties" showBack onBack={onBack} />

      <div className="mobile-content">
        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {propertyTypes.map((type) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                className={`whitespace-nowrap ${
                  selectedType === type ? "bg-primary text-primary-foreground" : "bg-transparent"
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Available Properties</h2>
          <span className="text-sm text-muted-foreground">{filteredProperties.length} properties</span>
        </div>

        {/* Properties Grid */}
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              className="property-card cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className="bg-primary text-primary-foreground">{property.type}</Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLikeProperty(property)
                      }}
                      className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          likedProperties.has(property.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{property.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold mb-1">{property.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{property.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-bold text-primary">{property.price}</span>
                        <span className="text-sm text-muted-foreground">/{property.priceUnit}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Maximize className="h-4 w-4" />
                        <span>{property.size}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {property.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {property.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{property.features.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => onSelectProperty(property)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Properties Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
