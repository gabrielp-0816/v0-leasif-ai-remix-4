export type UserRole = "tenant" | "landlord"

export interface User {
  id: string
  email: string
  fullName: string
  phoneNumber: string
  role: UserRole
  avatar?: string
  createdAt: Date
  // Additional profile fields
  bio?: string
  company?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  // Landlord-specific fields
  propertiesOwned?: number
  totalRevenue?: number
  // Tenant-specific fields
  currentLease?: string
  moveInDate?: Date
  budget?: number
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: UserRole
  message: string
  timestamp: Date
  read: boolean
}

export interface Conversation {
  id: string
  landlordId: string
  landlordName: string
  tenantId: string
  tenantName: string
  propertyId?: string
  propertyName?: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  tenantAvatar?: string
  landlordAvatar?: string
  isArchived?: boolean
}
