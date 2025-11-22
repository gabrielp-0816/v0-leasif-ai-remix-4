"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

interface SplashScreenProps {
  onSelectRole: (role: "tenant" | "landlord") => void
}

export function SplashScreen({ onSelectRole }: SplashScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-900 p-6">
      <div className="text-center space-y-8 max-w-sm">
        <div className="space-y-6">
          <div className="flex justify-center">
            <Image
              src="/images/leasifai-logo-new.jpeg"
              alt="LeasifAI Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2 text-primary">LeasifAI</h1>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Gateway to</h2>
            <h2 className="text-xl font-semibold text-gray-800">Commercial Leasing</h2>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600 max-w-xs mx-auto">
          <p>Connecting property owners with</p>
          <p>MSMEs for seamless, smart, and</p>
          <p>efficient lease management.</p>
        </div>

        <div className="space-y-3 pt-6 w-full">
          <Button
            onClick={() => onSelectRole("tenant")}
            className="w-full bg-primary text-white hover:bg-primary/90 font-semibold py-3 rounded-lg"
          >
            Tenant Login / Signup
          </Button>
          <Button
            onClick={() => onSelectRole("landlord")}
            className="w-full text-white hover:bg-accent/90 font-semibold py-3 rounded-lg bg-orange-400"
          >
            Landlord Login / Signup
          </Button>
        </div>
      </div>
    </div>
  )
}
