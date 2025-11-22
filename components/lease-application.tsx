"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MobileHeader } from "@/components/mobile-header"
import { CheckCircle, User, Building, Calendar, AlertCircle, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Property {
  id: string
  title: string
  location: string
  price: string
}

interface LeaseApplicationProps {
  property: Property
  onBack: () => void
  onSubmit?: () => void
}

export function LeaseApplication({ property, onBack, onSubmit }: LeaseApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    customBusinessType: "",
    leaseTermMonths: "",
    startDate: "",
    specialRequirements: [] as string[],
    customRequirements: "",
    additionalInfo: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSpecialRequirementsChange = (requirement: string) => {
    setFormData((prev) => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter((r) => r !== requirement)
        : [...prev.specialRequirements, requirement],
    }))
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setShowConfirmation(true)
    if (onSubmit) {
      onSubmit()
    }
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    setSubmitted(true)
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("navigateToContracts", { detail: { property, formData } }))
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="mobile-content flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Application Submitted!</h1>
          <p className="text-muted-foreground">
            Your lease application for {property.title} has been successfully submitted.
          </p>
          <p className="text-sm text-muted-foreground">
            We'll review your application and contact you within 2-3 business days.
          </p>
          <Button onClick={onBack} className="mt-4 w-full">
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Lease Application" showBack onBack={onBack} />

      <div className="mobile-content">
        {/* Progress Indicator */}
        <div className="mb-6 flex gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className={`flex-1 h-2 rounded-full ${step <= currentStep ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        {/* Property Summary */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">{property.title}</h2>
            <p className="text-sm text-muted-foreground mb-1">{property.location}</p>
            <p className="text-lg font-bold text-primary">{property.price}/month</p>
          </CardContent>
        </Card>

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <Card className="mb-6 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Business Information */}
        {currentStep === 2 && (
          <Card className="mb-6 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  placeholder="Your Business Name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleSelectChange("businessType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail Store</SelectItem>
                    <SelectItem value="restaurant">Restaurant/Cafe</SelectItem>
                    <SelectItem value="office">Office/Coworking</SelectItem>
                    <SelectItem value="fitness">Fitness/Wellness</SelectItem>
                    <SelectItem value="salon">Beauty/Salon</SelectItem>
                    <SelectItem value="services">Professional Services</SelectItem>
                    <SelectItem value="tech">Technology/Startup</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="education">Education/Training</SelectItem>
                    <SelectItem value="healthcare">Healthcare/Medical</SelectItem>
                    <SelectItem value="logistics">Logistics/Warehouse</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.businessType === "other" && (
                <div className="space-y-2">
                  <Label htmlFor="customBusinessType">Please specify your business type</Label>
                  <Input
                    id="customBusinessType"
                    name="customBusinessType"
                    placeholder="Enter your business type"
                    value={formData.customBusinessType}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Lease Terms and Special Requirements */}
        {currentStep === 3 && (
          <Card className="mb-6 border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Lease Terms & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="leaseTermMonths">Lease Term (Months)</Label>
                <Select
                  value={formData.leaseTermMonths}
                  onValueChange={(value) => handleSelectChange("leaseTermMonths", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lease term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">1 Year</SelectItem>
                    <SelectItem value="24">2 Years</SelectItem>
                    <SelectItem value="36">3 Years</SelectItem>
                    <SelectItem value="60">5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Preferred Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-3">
                <Label>Special Requirements</Label>
                <div className="space-y-2">
                  {[
                    "Parking Available",
                    "24/7 Access",
                    "Loading Dock",
                    "High Ceilings",
                    "Natural Light",
                    "Outdoor Space",
                    "Wheelchair Accessible",
                    "Pet Friendly",
                    "Flexible Hours",
                    "Security System",
                  ].map((requirement) => (
                    <label key={requirement} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specialRequirements.includes(requirement)}
                        onChange={() => handleSpecialRequirementsChange(requirement)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm">{requirement}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customRequirements">Other Requirements</Label>
                <Textarea
                  id="customRequirements"
                  name="customRequirements"
                  placeholder="Any other special requirements..."
                  value={formData.customRequirements}
                  onChange={handleInputChange}
                  className="min-h-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  placeholder="Any additional details or special requests..."
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
            className="bg-transparent"
          >
            Previous
          </Button>
          {currentStep < 3 ? (
            <Button onClick={handleNextStep} className="bg-primary hover:bg-primary/90">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              Submit Application
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Application Submitted</DialogTitle>
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-lg font-semibold">Your application has been received!</h2>
              <p className="text-sm text-muted-foreground">
                Thank you for applying to lease {property.title}. Your application is now under review.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">What happens next?</p>
                <p>
                  Please wait at least a few hours before the landlord can review and accept your application. You'll
                  receive a notification once they respond.
                </p>
              </div>
            </div>
            <Button onClick={handleConfirmationClose} className="w-full bg-primary hover:bg-primary/90">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
