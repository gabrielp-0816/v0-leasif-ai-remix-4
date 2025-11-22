export type NotificationType =
  | "message"
  | "lease_request"
  | "contract_update"
  | "payment_due"
  | "property_update"
  | "feasibility_complete"
  | "system"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: {
    propertyId?: string
    contractId?: string
    conversationId?: string
    [key: string]: any
  }
}
