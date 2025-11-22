"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  Edit2,
  Save,
  LogOut,
} from "lucide-react"
import type { User } from "@/types/user"

interface ProfileScreenProps {
  user: User
  onBack: () => void
  onUpdateProfile: (updatedUser: Partial<User>) => void
  onLogout: () => void
}

export function ProfileScreen({ user, onBack, onUpdateProfile, onLogout }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    bio: user.bio || "",
    company: user.company || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    zipCode: user.zipCode || "",
  })

  const isLandlord = user.role === "landlord"
  const accentColor = isLandlord ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
  const borderColor = isLandlord ? "border-accent" : "border-primary"

  const handleSave = () => {
    onUpdateProfile(formData)
    setIsEditing(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className={`${accentColor} px-4 py-6`}>
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-current">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Profile</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="text-current"
          >
            {isEditing ? <Save className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
          </Button>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
              <AvatarFallback className="text-2xl">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background text-foreground"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-4">{user.fullName}</h2>
          <p className="text-sm opacity-90 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="px-4 py-6 space-y-6">
        {/* Stats Card - Role Specific */}
        {isLandlord ? (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Landlord Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${accentColor}`}>
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.propertiesOwned || 0}</p>
                  <p className="text-xs text-muted-foreground">Properties</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${accentColor}`}>
                  <span className="text-lg">₱</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">₱{((user.totalRevenue || 0) / 1000).toFixed(1)}K</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Tenant Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${accentColor}`}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Move-in Date</p>
                  <p className="font-medium">
                    {user.moveInDate ? new Date(user.moveInDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${accentColor}`}>
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">₱{(user.budget || 0).toLocaleString()}/month</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Contact Information */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Bio */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">About</h3>
          {isEditing ? (
            <Textarea
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{user.bio || "No bio added yet."}</p>
          )}
        </Card>

        {/* Company (Landlord) or Address */}
        {isLandlord && (
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Company Information</h3>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              {isEditing ? (
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  placeholder="Your company name"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{user.company || "Not specified"}</p>
              )}
            </div>
          </Card>
        )}

        {/* Address Information */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Address
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="123 Main St"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{user.address || "Not specified"}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                {isEditing ? (
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="City"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{user.city || "Not specified"}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                {isEditing ? (
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder="State"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{user.state || "Not specified"}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              {isEditing ? (
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  placeholder="12345"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{user.zipCode || "Not specified"}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Account Information */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Account Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Member Since</span>
              <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Account Type</span>
              <span className="text-sm font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="text-sm font-mono">{user.id.slice(0, 8)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-destructive/50">
          <Button variant="destructive" className="w-full" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </Card>
      </div>
    </div>
  )
}
