"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MobileHeader } from "@/components/mobile-header"
import { Building, Briefcase, DollarSign, Users, Settings } from "lucide-react"
import type { PropertyDetails, BusinessDetails } from "@/lib/openai"

interface FeasibilityFormProps {
  property: any
  onSubmit: (propertyDetails: PropertyDetails, businessDetails: BusinessDetails) => void
  onBack: () => void
  isLoading: boolean
}

const businessTypes = [
  "Restaurant/Cafe",
  "Retail Store",
  "Office/Coworking",
  "Fitness/Wellness",
  "Beauty/Salon",
  "Professional Services",
  "Technology/Startup",
  "Manufacturing",
  "Warehouse/Storage",
  "Other",
]

const specialRequirements = [
  "High-speed Internet",
  "Kitchen Facilities",
  "Loading Dock",
  "Parking Spaces",
  "Security System",
  "Climate Control",
  "Accessibility Features",
  "Outdoor Space",
  "24/7 Access",
  "Backup Power",
  "Soundproofing",
  "Natural Lighting",
  "Elevator Access",
  "Wheelchair Accessible",
  "Pet Friendly",
  "Flexible Layout",
]

export function FeasibilityForm({ property, onSubmit, onBack, isLoading }: FeasibilityFormProps) {
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessType: "",
    targetMarket: "",
    expectedRevenue: "",
    employeeCount: "",
    operatingHours: "",
    specialRequirements: [],
    startingCapital: "",
    workingCapital: "",
    contingencyCapital: "",
  })

  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([])

  const handleRequirementChange = (requirement: string, checked: boolean) => {
    if (checked) {
      setSelectedRequirements([...selectedRequirements, requirement])
    } else {
      setSelectedRequirements(selectedRequirements.filter((r) => r !== requirement))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const propertyDetails: PropertyDetails = {
      title: property?.title || "Commercial Property",
      location: property?.location || "Business District",
      price: property?.price || "$5,000/month",
      size: property?.size || "2,000 sq ft",
      type: property?.type || "Commercial Space",
      amenities: property?.amenities || ["Parking", "Security", "HVAC"],
      description: property?.description || "Modern commercial space in prime location",
    }

    const finalBusinessDetails: BusinessDetails = {
      ...businessDetails,
      specialRequirements: selectedRequirements,
    }

    onSubmit(propertyDetails, finalBusinessDetails)
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Business Details" showBack onBack={onBack} />

      <div className="mobile-content">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Property: {property?.title || "Selected Property"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Tell us about your business to generate a personalized feasibility study
            </p>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Type */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={businessDetails.businessType}
                  onValueChange={(value) => setBusinessDetails({ ...businessDetails, businessType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetMarket">Target Market</Label>
                <Input
                  id="targetMarket"
                  placeholder="e.g., Young professionals, families, tourists"
                  value={businessDetails.targetMarket}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, targetMarket: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Capital Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startingCapital">Starting Capital</Label>
                <Input
                  id="startingCapital"
                  placeholder="e.g., ₱500,000"
                  value={businessDetails.startingCapital}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, startingCapital: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingCapital">Working Capital</Label>
                <Input
                  id="workingCapital"
                  placeholder="e.g., ₱200,000"
                  value={businessDetails.workingCapital}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, workingCapital: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contingencyCapital">Contingency Capital</Label>
                <Input
                  id="contingencyCapital"
                  placeholder="e.g., ₱100,000"
                  value={businessDetails.contingencyCapital}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, contingencyCapital: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Operational Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Number of Employees</Label>
                <Input
                  id="employeeCount"
                  placeholder="e.g., 5-10"
                  value={businessDetails.employeeCount}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, employeeCount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Input
                  id="operatingHours"
                  placeholder="e.g., 9 AM - 6 PM, Monday-Friday"
                  value={businessDetails.operatingHours}
                  onChange={(e) => setBusinessDetails({ ...businessDetails, operatingHours: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Special Requirements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                Special Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {specialRequirements.map((requirement) => (
                  <div key={requirement} className="flex items-center space-x-2">
                    <Checkbox
                      id={requirement}
                      checked={selectedRequirements.includes(requirement)}
                      onCheckedChange={(checked) => handleRequirementChange(requirement, checked as boolean)}
                    />
                    <Label htmlFor={requirement} className="text-sm">
                      {requirement}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
          >
            {isLoading ? "Generating Study..." : "Generate Feasibility Study"}
          </Button>
        </form>
      </div>
    </div>
  )
}
