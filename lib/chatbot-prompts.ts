// Pre-defined prompts and examples for different scenarios

export const TENANT_PROMPTS = {
  leaseTerms: "What are the typical lease terms for commercial properties?",
  maintenance: "How do I report a maintenance issue?",
  payment: "What payment methods are accepted?",
  viewing: "How can I schedule a property viewing?",
  contract: "Can you explain the lease agreement?",
  moveIn: "What should I expect during move-in?",
  moveOut: "What are the move-out procedures?",
  renewal: "How do I renew my lease?",
}

export const LANDLORD_PROMPTS = {
  screening: "How do I screen potential tenants?",
  listing: "How do I list a new property?",
  maintenance: "How do I manage maintenance requests?",
  payment: "How do I track tenant payments?",
  lease: "How do I customize a lease agreement?",
  tenant: "How do I communicate with tenants?",
  analytics: "How do I view property analytics?",
  renewal: "How do I handle lease renewals?",
}

export const COMMON_QUESTIONS = {
  platform: "How do I use the LeasifAI platform?",
  account: "How do I update my account information?",
  support: "How do I contact support?",
  security: "How is my data protected?",
  billing: "What are the pricing plans?",
}

export const ESCALATION_TRIGGERS = [
  "legal",
  "lawsuit",
  "dispute",
  "emergency",
  "urgent",
  "critical",
  "breach",
  "violation",
  "eviction",
  "contract negotiation",
  "complex",
  "human support",
  "speak to someone",
  "agent",
]

export const CHATBOT_RESPONSES = {
  welcome: {
    tenant:
      "Welcome to LeasifAI Assistant! I'm here to help you with lease-related questions, platform navigation, and property information. What can I help you with today?",
    landlord:
      "Welcome to LeasifAI Assistant! I'm here to help you manage your properties, tenants, and leases. What would you like to know?",
  },
  escalation:
    "I understand this is an important matter. Based on the nature of your question, I recommend connecting with our human support team who can provide specialized assistance. They'll be able to help you with complex issues like this. Would you like me to escalate your case?",
  error:
    "Sorry, I encountered an error processing your request. Please try again or contact support if the issue persists.",
  notFound:
    "I'm not sure how to help with that specific question. Could you rephrase it or ask about lease terms, platform features, or property management?",
}
