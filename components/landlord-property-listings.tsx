"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileHeader } from "@/components/mobile-header"
import { PropertyForm } from "@/components/property-form"
import { PropertyDetailsView } from "@/components/property-details-view"
import { LoadingScreen } from "@/components/loading-screen"
import { Building, Plus, MapPin, Users, Calendar } from "lucide-react"
import type { Property, PropertyFormData } from "@/types/property"
import type { User } from "@/types/user"

interface LandlordPropertyListingsProps {
  onBack: () => void
  user: User | null
}

// Mock data for landlord's properties
const mockLandlordProperties: Property[] = [
  {
    id: "1",
    title: "Downtown Office Complex",
    description: "Modern office space in the heart of the business district",
    location: "Downtown Business District",
    address: "123 Business Ave, City Center",
    price: 15000,
    priceUnit: "month",
    size: 2500,
    sizeUnit: "sqft",
    type: "office",
    status: "occupied",
    images: ["/images/property-1.jpg"],
    amenities: ["Parking", "Security", "HVAC", "Conference Room"],
    features: ["High Ceilings", "Natural Light", "Recently Renovated"],
    rating: 4.9,
    reviewCount: 24,
    ownerId: "landlord1",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-10-01"),
  },
  {
    id: "2",
    title: "Retail Space Main Street",
    description: "Prime retail location with high foot traffic",
    location: "Main Street Shopping Area",
    address: "456 Main St, Shopping District",
    price: 12000,
    priceUnit: "month",
    size: 1800,
    sizeUnit: "sqft",
    type: "retail",
    status: "available",
    images: ["/images/property-2.jpg"],
    amenities: ["Ground Floor", "Parking", "Storage Space"],
    features: ["Corner Unit", "Large Windows", "Move-in Ready"],
    rating: 4.7,
    reviewCount: 18,
    ownerId: "landlord1",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2023-09-15"),
  },
  {
    id: "3",
    title: "Creative Studio Warehouse",
    description: "Spacious warehouse perfect for creative businesses",
    location: "Arts District",
    address: "789 Creative Ave, Arts Quarter",
    price: 8500,
    priceUnit: "month",
    size: 3200,
    sizeUnit: "sqft",
    type: "studio",
    status: "maintenance",
    images: ["/images/property-3.jpg"],
    amenities: ["Loading Dock", "High Ceilings", "Open Layout"],
    features: ["Industrial Style", "Flexible Space", "Parking"],
    rating: 4.8,
    reviewCount: 15,
    ownerId: "landlord1",
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2023-10-20"),
  },
]

export function LandlordPropertyListings({ onBack, user }: LandlordPropertyListingsProps) {
  const [properties, setProperties] = useState<Property[]>(mockLandlordProperties)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddProperty = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleFormSubmit = async (data: PropertyFormData) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingProperty) {
        // Update existing property
        const updatedProperty: Property = {
          ...editingProperty,
          ...data,
          price: Number.parseFloat(data.price),
          size: Number.parseFloat(data.size),
          updatedAt: new Date(),
        }
        setProperties((prev) => prev.map((p) => (p.id === editingProperty.id ? updatedProperty : p)))
        setSelectedProperty(updatedProperty)
      } else {
        // Add new property
        const newProperty: Property = {
          id: Date.now().toString(),
          ...data,
          price: Number.parseFloat(data.price),
          size: Number.parseFloat(data.size),
          status: "draft",
          rating: 0,
          reviewCount: 0,
          ownerId: user?.id || "landlord1",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setProperties((prev) => [newProperty, ...prev])
      }

      setShowForm(false)
      setEditingProperty(null)
    } catch (error) {
      console.error("Error saving property:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProperty = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId))
  }

  const handleBack = () => {
    if (selectedProperty) {
      setSelectedProperty(null)
    } else if (showForm) {
      setShowForm(false)
      setEditingProperty(null)
    } else {
      onBack()
    }
  }

  const getStatusColor = (status: Property["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700"
      case "occupied":
        return "bg-blue-100 text-blue-700"
      case "maintenance":
        return "bg-yellow-100 text-yellow-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (isLoading) {
    return <LoadingScreen message="Saving property..." />
  }

  if (selectedProperty) {
    return (
      <PropertyDetailsView
        property={selectedProperty}
        onBack={() => setSelectedProperty(null)}
        onEdit={(updatedProperty) => {
          setProperties((prev) => prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)))
          setSelectedProperty(updatedProperty)
        }}
        onDelete={handleDeleteProperty}
      />
    )
  }

  if (showForm) {
    return (
      <PropertyForm
        property={editingProperty || undefined}
        onSubmit={handleFormSubmit}
        onBack={handleBack}
        isLoading={isLoading}
      />
    )
  }

  const totalRevenue = properties.filter((p) => p.status === "occupied").reduce((sum, p) => sum + p.price, 0)
  const occupiedCount = properties.filter((p) => p.status === "occupied").length
  const availableCount = properties.filter((p) => p.status === "available").length

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="My Properties" showBack onBack={handleBack} />

      <div className="mobile-content">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="stat-card">
            <CardContent className="p-3">
              <div className="text-center">
                <Building className="h-5 w-5 text-accent mx-auto mb-1" />
                <div className="text-lg font-bold">{properties.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-3">
              <div className="text-center">
                <span className="h-5 w-5 text-green-600 mx-auto mb-1 text-lg">₱</span>
                <div className="text-lg font-bold">₱{totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Monthly</div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="p-3">
              <div className="text-center">
                <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold">
                  {occupiedCount}/{properties.length}
                </div>
                <div className="text-xs text-muted-foreground">Occupied</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Property Button */}
        <Button
          onClick={handleAddProperty}
          className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 mb-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Property
        </Button>

        {/* Properties List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Properties</h2>
            <span className="text-sm text-muted-foreground">{properties.length} properties</span>
          </div>

          <div className="space-y-3">
            {properties.map((property) => (
              <Card key={property.id} className="property-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="h-8 w-8 text-accent" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 cursor-pointer" onClick={() => setSelectedProperty(property)}>
                          <h3 className="font-semibold text-sm truncate">{property.title}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground truncate">{property.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm font-semibold text-accent">
                          ₱{property.price.toLocaleString()}/{property.priceUnit}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {property.size} {property.sizeUnit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs capitalize ${getStatusColor(property.status)}`}>
                          {property.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {property.updatedAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
