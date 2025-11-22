"use client"

import Image from "next/image"

interface AppIconProps {
  size?: number
  className?: string
}

export function AppIcon({ size = 60, className = "" }: AppIconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/images/leasifai-logo-new.jpeg"
        alt="LeasifAI App Icon"
        width={size}
        height={size}
        className="rounded-2xl shadow-lg"
      />
    </div>
  )
}
