"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileHeader } from "@/components/mobile-header"
import { FeasibilityForm } from "@/components/feasibility-form"
import { LoadingScreen } from "@/components/loading-screen"
import { MapPin, Users, AlertTriangle, CheckCircle, Target, BarChart3, Map } from "lucide-react"
import {
  generateFeasibilityStudy,
  type PropertyDetails,
  type BusinessDetails,
  type FeasibilityAnalysis,
} from "@/lib/openai"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Property {
  id: string
  title: string
  location: string
  price: string
}

interface FeasibilityStudyProps {
  property: Property
  onBack: () => void
  onApplyForLease: (property: Property) => void
}

export function FeasibilityStudy({ property, onBack, onApplyForLease }: FeasibilityStudyProps) {
  const [showForm, setShowForm] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<FeasibilityAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (propertyDetails: PropertyDetails, businessDetails: BusinessDetails) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await generateFeasibilityStudy(propertyDetails, businessDetails)
      setAnalysis(result)
      setShowForm(false)
    } catch (error) {
      console.error("[v0] Error generating feasibility study:", error)
      setError("Failed to generate feasibility study. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (showForm) {
      onBack()
    } else {
      setShowForm(true)
      setAnalysis(null)
      setError(null)
    }
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader title="Feasibility Study" showBack onBack={onBack} />
        <div className="mobile-content">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Property information not available</p>
              <Button onClick={onBack} className="mt-4">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingScreen message="AI is analyzing your business feasibility..." />
  }

  if (showForm) {
    return (
      <>
        <FeasibilityForm property={property} onSubmit={handleFormSubmit} onBack={handleBack} isLoading={isLoading} />
        {error && (
          <div className="fixed bottom-20 left-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </>
    )
  }

  if (!analysis) {
    return <LoadingScreen message="Loading analysis..." />
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "low":
        return "default"
      case "medium":
        return "secondary"
      case "high":
        return "destructive"
      default:
        return "outline"
    }
  }

  const projectionData = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 72 },
    { month: "Mar", value: 78 },
    { month: "Apr", value: 85 },
    { month: "May", value: 88 },
    { month: "Jun", value: 92 },
    { month: "Jul", value: 95 },
    { month: "Aug", value: 98 },
  ]

  const marketDemandData = [
    { month: "Jan", demand: 45 },
    { month: "Feb", demand: 52 },
    { month: "Mar", demand: 48 },
    { month: "Apr", demand: 61 },
    { month: "May", demand: 55 },
    { month: "Jun", demand: 67 },
    { month: "Jul", demand: 72 },
    { month: "Aug", demand: 78 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader title="Feasibility Study" showBack onBack={handleBack} />

      <div className="mobile-content">
        {/* Property Header */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold mb-1">{property.title}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="h-4 w-4" />
              <span>{property.location}</span>
            </div>
            <Badge variant={getRiskBadgeVariant(analysis.riskLevel)} className="capitalize">
              {analysis.riskLevel} Risk
            </Badge>
          </CardContent>
        </Card>

        {/* Projection Success Rate Chart */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Projection Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Local Market Demand Chart */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Local Market Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={marketDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="demand" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="mb-4 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Area Heat Map Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-blue-50 to-red-50 border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3855555%3A0xb89d1fe6bc499443!2s123%20Business%20Ave%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1234567890"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-sm font-semibold text-blue-600">12</div>
                <p className="text-xs text-muted-foreground">Competitors</p>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <div className="text-sm font-semibold text-orange-600">High</div>
                <p className="text-xs text-muted-foreground">Foot Traffic</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-sm font-semibold text-green-600">8</div>
                <p className="text-xs text-muted-foreground">Landmarks</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground space-y-1">
              <p>
                • <strong>Landmarks:</strong> 2 Schools, 2 Parks, 1 Museum, 2 Transit Hubs, 1 Shopping Center
              </p>
              <p>
                • <strong>Competitor Density:</strong> Moderate - Good opportunity for differentiation
              </p>
              <p>
                • <strong>Foot Traffic:</strong> High during peak hours (9-11 AM, 5-7 PM)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.executiveSummary}</p>
          </CardContent>
        </Card>

        {/* Key Insights */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.keyInsights.slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.recommendations.slice(0, 3).map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competitor Analysis */}
        <Card className="mb-4 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Market Competition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.competitorAnalysis}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button className="bg-primary hover:bg-primary/90" onClick={() => onApplyForLease(property)}>
            Proceed to Apply
          </Button>
          <Button variant="outline" onClick={() => setShowForm(true)}>
            Modify Analysis
          </Button>
        </div>
      </div>
    </div>
  )
}
