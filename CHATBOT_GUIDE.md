# LeasifAI AI Chatbot Implementation Guide

## Overview

The LeasifAI AI Chatbot is an intelligent assistant designed to help tenants and property owners navigate lease management, answer platform-related questions, and provide personalized guidance based on their role and context.

## Features

### 1. **Role-Based Conversations**
- **Tenant Mode**: Focuses on lease terms, maintenance requests, payment questions, and property viewing procedures
- **Landlord Mode**: Focuses on tenant management, lease customization, property maintenance coordination, and financial tracking

### 2. **Conversation Memory**
- Automatically saves chat history to localStorage
- Maintains context across sessions
- Allows users to clear chat history when needed

### 3. **Intelligent Escalation**
- Automatically detects complex issues (legal disputes, emergencies, contract negotiations)
- Escalates to human support when needed
- Creates support tickets for complex matters

### 4. **Property Context Awareness**
- Understands property-specific information
- Provides contextual responses based on property type and rental amount
- Helps with property-specific questions

### 5. **Compact Widget & Full-Screen Mode**
- Floating widget for quick access from any dashboard screen
- Full-screen chatbot screen for dedicated conversations
- Seamless switching between modes

## Architecture

### Components

#### `ai-chatbot.tsx`
Main chatbot component with:
- Message display and input
- Conversation memory management
- Loading states and error handling
- Auto-scroll to latest messages

#### `chatbot-widget.tsx`
Wrapper component that:
- Manages escalation tickets
- Displays escalation notifications
- Provides compact floating widget interface

#### `chatbot-screen.tsx`
Full-screen chatbot interface for dedicated conversations

### API Route

#### `/api/chat`
Handles AI-powered responses:
- Processes user messages
- Generates contextual responses using OpenAI GPT-4o-mini
- Detects escalation needs
- Returns structured responses

### Types

#### `ChatMessage`
\`\`\`typescript
interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  requiresEscalation?: boolean
}
\`\`\`

#### `ChatSession`
\`\`\`typescript
interface ChatSession {
  id: string
  userId: string
  userRole: "tenant" | "landlord"
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  propertyContext?: {
    propertyId?: string
    propertyName?: string
    propertyType?: string
    rentAmount?: number
  }
}
\`\`\`

## Usage

### Basic Integration

\`\`\`tsx
import { ChatbotWidget } from "@/components/chatbot-widget"

export function MyDashboard({ user }) {
  return (
    <div>
      {/* Your dashboard content */}
      <ChatbotWidget
        userId={user.id}
        userRole={user.role}
        propertyContext={{
          propertyName: "Downtown Office",
          rentAmount: 8500,
        }}
      />
    </div>
  )
}
\`\`\`

### Full-Screen Chatbot

\`\`\`tsx
import { ChatbotScreen } from "@/components/chatbot-screen"

export function MyPage({ user }) {
  return <ChatbotScreen user={user} onBack={() => navigate("dashboard")} />
}
\`\`\`

## Example Conversations

### Tenant Asking About Lease Terms

**User**: "What are the typical lease terms for commercial properties?"

**Assistant**: "Commercial leases typically range from 1-5 years, with most being 3-year agreements. Key terms include:
- **Lease Duration**: The fixed period you're committed to
- **Rent Amount**: Monthly payment (usually fixed or with annual increases)
- **Security Deposit**: Typically 1-3 months of rent
- **Maintenance Responsibilities**: Landlord vs. tenant obligations
- **Renewal Options**: Whether you can extend after the initial term

Would you like to know more about any specific lease term?"

### Landlord Asking About Tenant Management

**User**: "How do I screen potential tenants?"

**Assistant**: "Here's a comprehensive tenant screening process:

1. **Application Review**: Verify business information and financial details
2. **Credit Check**: Review business credit history and payment patterns
3. **References**: Contact previous landlords and business partners
4. **Financial Verification**: Confirm revenue and ability to pay rent
5. **Background Check**: Verify business legitimacy and compliance

LeasifAI can help you manage this process through our platform. Would you like guidance on any specific screening step?"

### Escalation Example

**User**: "I need to break my lease early due to an emergency. What are my legal options?"

**Assistant**: "I understand this is an important matter. Based on the nature of your question, I recommend connecting with our human support team who can provide specialized assistance. They'll be able to help you with complex issues like lease termination and legal matters. Would you like me to escalate your case?"

## Customization

### Adding New System Prompts

Edit `/app/api/chat/route.ts` to customize the system prompt:

\`\`\`typescript
const getSystemPrompt = (userRole: "tenant" | "landlord") => {
  // Customize prompts here
}
\`\`\`

### Modifying Escalation Keywords

Update the `shouldEscalate` function to detect additional escalation triggers:

\`\`\`typescript
const escalationKeywords = [
  "legal",
  "lawsuit",
  // Add more keywords
]
\`\`\`

### Changing AI Model

Update the model in `/app/api/chat/route.ts`:

\`\`\`typescript
const { text } = await generateText({
  model: "openai/gpt-4-turbo", // Change model here
  // ...
})
\`\`\`

## Storage & Persistence

- Chat history is stored in browser localStorage
- Key format: `chatbot-session-{userId}`
- Sessions persist across browser refreshes
- Users can manually clear chat history

## Error Handling

The chatbot includes comprehensive error handling:
- Network errors display user-friendly messages
- Failed API calls show retry options
- Invalid inputs are validated before sending

## Performance Considerations

- Messages are streamed for better UX
- Conversation history is paginated for large chats
- localStorage is cleared periodically to manage storage
- API calls are debounced to prevent rate limiting

## Future Enhancements

1. **Multi-language Support**: Add support for multiple languages
2. **Voice Input/Output**: Enable voice-based conversations
3. **Document Analysis**: Allow users to upload lease documents for analysis
4. **Integration with CRM**: Connect with property management systems
5. **Analytics Dashboard**: Track common questions and user satisfaction
6. **Custom Training**: Fine-tune AI responses based on LeasifAI-specific data

## Troubleshooting

### Chatbot Not Responding
- Check API key configuration
- Verify network connectivity
- Check browser console for errors

### Chat History Not Saving
- Verify localStorage is enabled
- Check browser storage quota
- Clear browser cache and try again

### Escalation Not Working
- Verify escalation keywords are configured
- Check backend support ticket system
- Review API logs for errors

## Support

For issues or questions about the chatbot implementation, contact the LeasifAI development team.
