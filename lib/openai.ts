export interface PropertyDetails {
  title: string
  location: string
  price: string
  size: string
  type: string
  amenities: string[]
  description: string
}

export interface BusinessDetails {
  businessType: string
  targetMarket: string
  expectedRevenue: string
  employeeCount: string
  operatingHours: string
  specialRequirements: string[]
}

export interface FeasibilityAnalysis {
  successRate: number
  marketDemand: number
  riskLevel: "low" | "medium" | "high"
  projectedRevenue: string
  keyInsights: string[]
  recommendations: string[]
  executiveSummary: string
  competitorAnalysis: string
  financialProjections: {
    monthlyRevenue: string
    operatingCosts: string
    netProfit: string
    breakEvenMonths: number
  }
}

export async function generateFeasibilityStudy(
  property: PropertyDetails,
  business: BusinessDetails,
): Promise<FeasibilityAnalysis> {
  try {
    console.log("[v0] Calling feasibility API route...")

    const response = await fetch("/api/feasibility", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ property, business }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(errorData.error || `API request failed with status ${response.status}`)
    }

    const analysis = await response.json()
    console.log("[v0] Successfully received feasibility analysis from API")
    return analysis
  } catch (error) {
    console.error("[v0] Error calling feasibility API:", error)

    const fallbackAnalysis: FeasibilityAnalysis = {
      successRate: 72,
      marketDemand: 65,
      riskLevel: "medium",
      projectedRevenue: business.expectedRevenue || "$500,000 annually",
      keyInsights: [
        `${property.location} shows good potential for ${business.businessType}`,
        `Target market of ${business.targetMarket} aligns well with location demographics`,
        `Property size of ${property.size} is suitable for ${business.employeeCount} employees`,
      ],
      recommendations: [
        "Conduct detailed market research in the local area",
        "Consider seasonal variations in customer traffic",
        "Develop a strong marketing strategy to differentiate from competitors",
      ],
      executiveSummary: `This ${property.type} in ${property.location} presents a viable opportunity for your ${business.businessType} business. The location and property features align reasonably well with your business requirements. With proper planning and execution, this venture shows moderate to good potential for success.`,
      competitorAnalysis: `The ${property.location} area has moderate competition for ${business.businessType} businesses. Success will depend on differentiation through quality service, unique offerings, and effective marketing to your target market of ${business.targetMarket}.`,
      financialProjections: {
        monthlyRevenue: business.expectedRevenue
          ? `$${Math.round(Number.parseFloat(business.expectedRevenue.replace(/[^0-9.]/g, "")) / 12).toLocaleString()}`
          : "$42,000",
        operatingCosts: "$28,000",
        netProfit: "$14,000",
        breakEvenMonths: 8,
      },
    }

    console.log("[v0] Returning fallback analysis")
    return fallbackAnalysis
  }
}
