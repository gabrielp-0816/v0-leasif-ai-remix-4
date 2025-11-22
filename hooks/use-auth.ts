"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type { User, UserRole, AuthState } from "@/types/user"

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (updatedData: Partial<User>) => void
}

interface RegisterData {
  fullName: string
  email: string
  password: string
  phoneNumber: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useAuthProvider(): AuthContextType {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("leasifai_user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("leasifai_user")
      }
    }
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        fullName: role === "landlord" ? "John Property Owner" : "Jane Tenant",
        phoneNumber: "+1234567890",
        role,
        avatar: role === "landlord" ? "/images/landlord-avatar.jpg" : "/images/tenant-avatar.jpg",
        createdAt: new Date(),
        bio:
          role === "landlord"
            ? "Experienced property owner with 10+ years in commercial real estate"
            : "Looking for the perfect commercial space for my growing business",
        company: role === "landlord" ? "Property Management Inc." : "Tech Startup LLC",
        address: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        propertiesOwned: role === "landlord" ? 12 : undefined,
        totalRevenue: role === "landlord" ? 450000 : undefined,
        budget: role === "tenant" ? 5000 : undefined,
        moveInDate: role === "tenant" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
      }

      localStorage.setItem("leasifai_user", JSON.stringify(user))

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        avatar: userData.role === "landlord" ? "/images/landlord-avatar.jpg" : "/images/tenant-avatar.jpg",
        createdAt: new Date(),
        bio: "",
        company: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        propertiesOwned: userData.role === "landlord" ? 0 : undefined,
        totalRevenue: userData.role === "landlord" ? 0 : undefined,
        budget: userData.role === "tenant" ? 0 : undefined,
      }

      localStorage.setItem("leasifai_user", JSON.stringify(user))

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("leasifai_user")
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const updateProfile = (updatedData: Partial<User>) => {
    if (!authState.user) return

    const updatedUser = { ...authState.user, ...updatedData }
    localStorage.setItem("leasifai_user", JSON.stringify(updatedUser))
    setAuthState((prev) => ({ ...prev, user: updatedUser }))
  }

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  }
}

export { AuthContext }
