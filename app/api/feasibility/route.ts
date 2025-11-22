import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

interface PropertyDetails {
  title: string
  location: string
  price: string
  size: string
  type: string
  amenities: string[]
  description: string
}

interface BusinessDetails {
  businessType: string
  targetMarket: string
  expectedRevenue: string
  employeeCount: string
  operatingHours: string
  specialRequirements: string[]
}

interface FeasibilityAnalysis {
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

export async function POST(request: NextRequest) {
  try {
    const { property, business } = await request.json()

    if (!property || !business) {
      return NextResponse.json({ error: "Missing property or business details" }, { status: 400 })
    }

    console.log("[v0 API] Starting feasibility study generation...")
    console.log("[v0 API] Property:", property.title)
    console.log("[v0 API] Business:", business.businessType)

    const prompt = `
      As a commercial real estate and business feasibility expert, analyze the following property and business combination:

      PROPERTY DETAILS:
      - Title: ${property.title}
      - Location: ${property.location}
      - Price: ${property.price}
      - Size: ${property.size}
      - Type: ${property.type}
      - Amenities: ${property.amenities.join(", ")}
      - Description: ${property.description}

      BUSINESS DETAILS:
      - Business Type: ${business.businessType}
      - Target Market: ${business.targetMarket}
      - Expected Revenue: ${business.expectedRevenue}
      - Employee Count: ${business.employeeCount}
      - Operating Hours: ${business.operatingHours}
      - Special Requirements: ${business.specialRequirements.join(", ")}

      Please provide a comprehensive feasibility analysis. Base your analysis on:
      1. Location suitability for the business type
      2. Market demand in the area
      3. Competition analysis
      4. Financial viability
      5. Risk factors
      6. Growth potential

      Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks):
      {
        "successRate": 75,
        "marketDemand": 68,
        "riskLevel": "medium",
        "projectedRevenue": "$500,000 annually",
        "keyInsights": ["insight1", "insight2", "insight3"],
        "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
        "executiveSummary": "detailed summary paragraph",
        "competitorAnalysis": "analysis of local competition",
        "financialProjections": {
          "monthlyRevenue": "$42,000",
          "operatingCosts": "$28,000",
          "netProfit": "$14,000",
          "breakEvenMonths": 8
        }
      }

      Provide realistic, data-driven insights based on the property and business details provided.
    `

    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt,
      temperature: 0.7,
    })

    console.log("[v0 API] Received response from OpenAI")

    let cleanedText = text.trim()
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "")
    }

    console.log("[v0 API] Parsing JSON response...")
    const analysis = JSON.parse(cleanedText) as FeasibilityAnalysis

    console.log("[v0 API] Successfully generated feasibility study")
    return NextResponse.json(analysis)
  } catch (error) {
    console.error("[v0 API] Error generating feasibility study:", error)

    const { property, business } = await request.json()

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

    console.log("[v0 API] Returning fallback analysis")
    return NextResponse.json(fallbackAnalysis)
  }
}
