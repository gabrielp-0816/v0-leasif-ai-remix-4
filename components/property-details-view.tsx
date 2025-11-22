"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileHeader } from "@/components/mobile-header"
import { PropertyForm } from "@/components/property-form"
import {
  MapPin,
  DollarSign,
  Ruler,
  Star,
  MessageSquare,
  Edit,
  MoreVertical,
  Trash2,
  Share2,
  Eye,
  Settings,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Property } from "@/types/property"

interface PropertyDetailsViewProps {
  property: Property
  onBack: () => void
  onEdit: (property: Property) => void
  onDelete: (propertyId: string) => void
}

export function PropertyDetailsView({ property, onBack, onEdit, onDelete }: PropertyDetailsViewProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handlePropertyAction = (action: string) => {
    switch (action) {
      case "edit":
        setIsEditing(true)
        break
      case "share":
        console.log("Sharing property:", property.id)
        break
      case "delete":
        onDelete(property.id)
        onBack()
        break
      case "analytics":
        console.log("Viewing analytics for property:", property.id)
        break
      case "settings":
        console.log("Opening settings for property:", property.id)
        break
    }
  }

  if (isEditing) {
    return (
      <PropertyForm
        property={property}
        onSubmit={(data) => {
          onEdit({ ...property, ...data })
          setIsEditing(false)
        }}
        onBack={() => setIsEditing(false)}
        isLoading={false}
      />
    )
  }

  const mapEmbedUrl = `/api/maps/embed?address=${encodeURIComponent(property.address)}`

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Property Details" showBack onBack={onBack} />

      <div className="mobile-content">
        {/* Property Header */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="font-semibold text-lg mb-2">{property.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{property.address}</span>
                </div>
                <Badge className="bg-blue-100 text-blue-700 capitalize">{property.status}</Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handlePropertyAction("edit")}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Property
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePropertyAction("share")}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Property
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePropertyAction("analytics")}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePropertyAction("settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handlePropertyAction("delete")} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Property
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{property.description}</p>
          </CardContent>
        </Card>

        {/* Pricing & Size */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pricing & Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Price</span>
                </div>
                <p className="font-semibold">
                  ₱{property.price.toLocaleString()}/{property.priceUnit}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Ruler className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Size</span>
                </div>
                <p className="font-semibold">
                  {property.size} {property.sizeUnit}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Location Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 rounded-lg overflow-hidden bg-muted">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(property.address)}&key=AIzaSyDummyKeyForEmbed`}
              ></iframe>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        {property.images && property.images.length > 0 && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Property Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {property.images.map((image, index) => (
                  <div key={index} className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature) => (
                  <Badge key={feature} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rating & Reviews */}
        {property.rating && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Rating & Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{property.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{property.reviewCount} reviews</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Button */}
        <Button
          onClick={() => handlePropertyAction("edit")}
          className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Property
        </Button>
      </div>
    </div>
  )
}
