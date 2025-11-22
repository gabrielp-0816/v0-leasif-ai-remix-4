"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MobileHeader } from "@/components/mobile-header"
import { Building, MapPin, DollarSign, ImageIcon, Plus, X, Map } from "lucide-react"
import type { Property, PropertyFormData } from "@/types/property"

interface PropertyFormProps {
  property?: Property
  onSubmit: (data: PropertyFormData) => void
  onBack: () => void
  isLoading: boolean
}

const propertyTypes = [
  { value: "office", label: "Office Space" },
  { value: "retail", label: "Retail Store" },
  { value: "warehouse", label: "Warehouse" },
  { value: "restaurant", label: "Restaurant/Cafe" },
  { value: "studio", label: "Studio/Creative Space" },
  { value: "other", label: "Other" },
]

const commonAmenities = [
  "Parking",
  "Security",
  "HVAC",
  "High-speed Internet",
  "Conference Room",
  "Kitchen/Pantry",
  "Elevator",
  "Loading Dock",
  "24/7 Access",
  "Reception Area",
  "Storage Space",
  "Outdoor Space",
  "Wheelchair Accessible",
  "Fire Safety System",
  "CCTV Surveillance",
  "Backup Generator",
  "Water Cooler",
  "Gym/Fitness Center",
  "Cafeteria",
  "Parking Garage",
  "Bike Storage",
  "EV Charging Station",
  "Rooftop Access",
  "Soundproof Rooms",
  "Meeting Pods",
  "Lounge Area",
  "Vending Machines",
  "Cleaning Service",
  "Waste Management",
  "Sprinkler System",
]

const commonFeatures = [
  "Ground Floor",
  "High Ceilings",
  "Natural Light",
  "Open Layout",
  "Private Entrance",
  "Corner Unit",
  "Recently Renovated",
  "Furnished",
  "Unfurnished",
  "Move-in Ready",
  "Soundproof",
  "Climate Controlled",
  "Flexible Layout",
  "Skylights",
  "Balcony/Terrace",
  "Mezzanine",
  "Separate Restrooms",
  "Kitchenette",
  "Breakroom",
  "Outdoor Seating",
  "Polished Concrete Floors",
  "Exposed Brick",
  "Industrial Windows",
  "Atrium",
  "Courtyard",
  "Green Walls",
  "Smart Building System",
  "Fiber Optic Ready",
  "Modular Workstations",
  "Collaborative Spaces",
]

export function PropertyForm({ property, onSubmit, onBack, isLoading }: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: property?.title || "",
    description: property?.description || "",
    location: property?.location || "",
    address: property?.address || "",
    price: property?.price?.toString() || "",
    priceUnit: property?.priceUnit || "month",
    size: property?.size?.toString() || "",
    sizeUnit: property?.sizeUnit || "sqft",
    type: property?.type || "office",
    amenities: property?.amenities || [],
    features: property?.features || [],
    images: property?.images || [],
  })

  const [newImageUrl, setNewImageUrl] = useState("")
  const [showMapPicker, setShowMapPicker] = useState(false)

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, amenities: [...prev.amenities, amenity] }))
    } else {
      setFormData((prev) => ({ ...prev, amenities: prev.amenities.filter((a) => a !== amenity) }))
    }
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, feature] }))
    } else {
      setFormData((prev) => ({ ...prev, features: prev.features.filter((f) => f !== feature) }))
    }
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }))
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, event.target?.result as string],
            }))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleMapPicker = () => {
    setShowMapPicker(true)
    // In a real implementation, this would open a Google Maps picker
    // For now, we'll show a placeholder
    console.log("Opening Google Maps picker for location selection")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isEditing = !!property

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title={isEditing ? "Edit Property" : "Add Property"} showBack onBack={onBack} />

      <div className="mobile-content">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-accent" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Modern Office Space Downtown"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property, its features, and what makes it special..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Area/District</Label>
                <Input
                  id="location"
                  placeholder="e.g., Downtown Business District"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Input
                  id="address"
                  placeholder="e.g., 123 Business Ave, City, State"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>

              <Button type="button" onClick={handleMapPicker} variant="outline" className="w-full bg-transparent">
                <Map className="h-4 w-4 mr-2" />
                Pinpoint Location on Google Maps
              </Button>
              {showMapPicker && (
                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  <p>Google Maps integration would appear here. Select your property location on the map.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing & Size */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Pricing & Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="5000"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceUnit">Per</Label>
                  <Select value={formData.priceUnit} onValueChange={(value) => handleInputChange("priceUnit", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    type="number"
                    placeholder="1200"
                    value={formData.size}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sizeUnit">Unit</Label>
                  <Select value={formData.sizeUnit} onValueChange={(value) => handleInputChange("sizeUnit", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqft">sq ft</SelectItem>
                      <SelectItem value="sqm">sq m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Property Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button type="button" onClick={addImage} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUpload">Or upload images</Label>
                <Input
                  id="imageUpload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
              </div>

              {formData.images.length > 0 && (
                <div className="space-y-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <span className="text-sm truncate flex-1">{url.substring(0, 50)}...</span>
                      <Button type="button" onClick={() => removeImage(index)} size="sm" variant="ghost">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {commonAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    />
                    <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {commonFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                    />
                    <Label htmlFor={`feature-${feature}`} className="text-sm">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3"
          >
            {isLoading ? "Saving..." : isEditing ? "Update Property" : "Add Property"}
          </Button>
        </form>
      </div>
    </div>
  )
}
