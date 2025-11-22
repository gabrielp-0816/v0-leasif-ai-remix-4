export interface Property {
  id: string
  title: string
  description: string
  location: string
  address: string
  price: number
  priceUnit: "month" | "year"
  size: number
  sizeUnit: "sqft" | "sqm"
  type: "office" | "retail" | "warehouse" | "restaurant" | "studio" | "other"
  status: "available" | "occupied" | "maintenance" | "draft"
  images: string[]
  amenities: string[]
  features: string[]
  rating: number
  reviewCount: number
  ownerId: string
  createdAt: Date
  updatedAt: Date
  coordinates?: {
    lat: number
    lng: number
  }
  virtualTour?: string
  floorPlan?: string
  documents?: string[]
}

export interface PropertyFormData {
  title: string
  description: string
  location: string
  address: string
  price: string
  priceUnit: "month" | "year"
  size: string
  sizeUnit: "sqft" | "sqm"
  type: Property["type"]
  amenities: string[]
  features: string[]
  images: string[]
}
