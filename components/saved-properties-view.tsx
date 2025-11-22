"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileHeader } from "@/components/mobile-header"
import { Building, MapPin, Star, Heart, Eye, Filter } from "lucide-react"

interface SavedProperty {
  id: string
  name: string
  location: string
  price: number
  rating: number
  image: string
  type: string
}

interface SavedPropertiesViewProps {
  onBack: () => void
  onViewProperty?: (property: SavedProperty) => void
  savedProperties?: SavedProperty[]
}

const mockAllSavedProperties: SavedProperty[] = [
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
  {
    id: "4",
    name: "Premium Warehouse",
    location: "Industrial Zone",
    price: 12000,
    rating: 4.7,
    image: "/images/property-4.jpg",
    type: "Warehouse",
  },
  {
    id: "5",
    name: "Coworking Hub",
    location: "Tech Park",
    price: 3500,
    rating: 4.9,
    image: "/images/property-1.jpg",
    type: "Coworking",
  },
  {
    id: "6",
    name: "Restaurant Space",
    location: "Food District",
    price: 7200,
    rating: 4.5,
    image: "/images/property-2.jpg",
    type: "Restaurant",
  },
]

export function SavedPropertiesView({ onBack, onViewProperty, savedProperties }: SavedPropertiesViewProps) {
  const [displayedProperties, setDisplayedProperties] = useState<SavedProperty[]>(
    savedProperties || mockAllSavedProperties,
  )
  const [filterType, setFilterType] = useState<string | null>(null)

  const filteredProperties = filterType ? displayedProperties.filter((p) => p.type === filterType) : displayedProperties

  const propertyTypes = Array.from(new Set(displayedProperties.map((p) => p.type)))

  const handleRemoveSaved = (id: string) => {
    setDisplayedProperties(displayedProperties.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Saved Properties" showBack onBack={onBack} />

      <div className="mobile-content">
        {/* Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by Type</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={filterType === null ? "default" : "outline"}
                onClick={() => setFilterType(null)}
                className={filterType === null ? "bg-primary hover:bg-primary/90" : "bg-transparent"}
              >
                All ({displayedProperties.length})
              </Button>
              {propertyTypes.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={filterType === type ? "default" : "outline"}
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? "bg-primary hover:bg-primary/90" : "bg-transparent"}
                >
                  {type} ({displayedProperties.filter((p) => p.type === type).length})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Properties Grid */}
        <div className="space-y-3">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <Card key={property.id} className="property-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex gap-3">
                    {/* Property Image */}
                    <div className="w-24 h-24 bg-primary/20 flex-shrink-0 flex items-center justify-center rounded-lg">
                      <Building className="h-8 w-8 text-primary" />
                    </div>

                    {/* Property Details */}
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{property.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {property.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{property.location}</span>
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
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 p-3 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent"
                        onClick={() => onViewProperty?.(property)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs p-1"
                        onClick={() => handleRemoveSaved(property.id)}
                      >
                        <Heart className="h-3 w-3 text-red-500 fill-current" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="property-card">
              <CardContent className="p-8 text-center">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No saved properties found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
