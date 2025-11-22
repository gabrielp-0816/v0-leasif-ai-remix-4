"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileHeader } from "@/components/mobile-header"
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Shield,
  Clock,
  Users,
  Edit,
  Settings,
  BarChart3,
  AlertCircle,
  Map,
  Heart,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"
import type { UserRole } from "@/types/user"
import { useState } from "react"

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
    profilePicture?: string
    rating?: number
    replySpeed?: string
  }
}

interface PropertyDetailsProps {
  property: Property | null
  onBack: () => void
  onFeasibilityStudy: () => void
  onApplyForLease: (property: Property) => void
  userRole: UserRole
  onSaveProperty?: (property: Property) => void
  isSaved?: boolean
}

export function PropertyDetails({
  property,
  onBack,
  onFeasibilityStudy,
  onApplyForLease,
  userRole,
  onSaveProperty,
  isSaved = false,
}: PropertyDetailsProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(isSaved)

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader title="Property Details" showBack onBack={onBack} />
        <div className="mobile-content">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-lg font-semibold">Property Not Found</h2>
              <p className="text-sm text-muted-foreground">The property you're looking for could not be loaded.</p>
              <Button onClick={onBack} className="w-full">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const photos = property.photos || [property.image]
  const currentPhoto = photos[currentPhotoIndex]

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (!isLiked) {
      onSaveProperty?.(property)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const keyFeatures = [
    { icon: Wifi, label: "High-Speed Internet", available: true },
    { icon: Car, label: "Parking Available", available: true },
    { icon: Coffee, label: "Cafeteria", available: false },
    { icon: Shield, label: "24/7 Security", available: true },
    { icon: Clock, label: "Flexible Hours", available: true },
    { icon: Users, label: "Meeting Rooms", available: true },
  ]

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Property Details" showBack onBack={onBack} />

      <div className="mobile-content">
        <div className="relative w-full rounded-xl overflow-hidden mb-4 bg-muted">
          <div className="relative w-full h-48">
            <Image
              src={currentPhoto || "/placeholder.svg?height=400&width=600&query=modern office space"}
              alt={`${property.title} - Photo ${currentPhotoIndex + 1}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Photo Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Photo Counter and Like Button */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">{property.type}</Badge>
            {photos.length > 1 && (
              <Badge variant="secondary" className="bg-black/50 text-white">
                {currentPhotoIndex + 1}/{photos.length}
              </Badge>
            )}
          </div>

          <button
            onClick={handleLike}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </div>

        {/* Photo Thumbnails */}
        {photos.length > 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentPhotoIndex ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Property Info */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h1 className="text-xl font-bold mb-1">{property.title || "Property"}</h1>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{property.location || "Location not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">{property.price || "₱0"}</span>
                  <span className="text-muted-foreground">/{property.priceUnit || "month"}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{property.rating || "N/A"}</span>
                  </div>
                </div>
              </div>

              {userRole === "landlord" ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button className="bg-accent hover:bg-accent/90 text-white font-semibold">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Property
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  onClick={() => onApplyForLease(property)}
                >
                  Apply for Lease
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {property.landlord && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-4">Landlord Contact</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent">
                      {property.landlord.profilePicture ? (
                        <Image
                          src={property.landlord.profilePicture || "/placeholder.svg"}
                          alt={property.landlord.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                          {property.landlord.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{property.landlord.name}</h3>
                    {property.landlord.rating && (
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(property.landlord.rating)}
                        <span className="text-sm font-medium">{property.landlord.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {property.landlord.replySpeed && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        <span>{property.landlord.replySpeed}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    {property.landlord.phone}
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About This Property */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">About This Property</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This prime commercial office space offers modern amenities and a professional environment for growing
              businesses. Located in the heart of downtown, it provides excellent visibility and accessibility for your
              clients and employees.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              The space features an open floor layout, multiple private offices, and a well-equipped conference room.
              Perfect for startups, consulting firms, or established businesses looking to expand their operations.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3">Key Features</h2>
            <div className="grid grid-cols-2 gap-3">
              {keyFeatures.map((feature) => (
                <div key={feature.label} className="flex items-center gap-2">
                  <div
                    className={`p-1 rounded ${feature.available ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <span className={`text-sm ${feature.available ? "text-foreground" : "text-muted-foreground"}`}>
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Location
            </h2>
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3 bg-muted">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3855555%3A0xb89d1fe6bc499443!2s123%20Business%20Ave%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-3">123 Business Ave, Cityville, State 12345</p>
            <Button variant="outline" className="w-full bg-transparent">
              <Map className="h-4 w-4 mr-2" />
              View on Google Maps
            </Button>
          </CardContent>
        </Card>

        {userRole === "tenant" && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <h3 className="font-semibold">Get a Feasibility Study</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze market potential and success probability for this property
                </p>
                <Button onClick={onFeasibilityStudy} className="w-full bg-primary hover:bg-primary/90">
                  Request Feasibility Study
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {userRole === "landlord" && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-3">Property Management</h2>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" className="bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Tenants
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
