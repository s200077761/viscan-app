/**
 * useChat Hook
 * Manages chat state and operations
 */

import { useState, useEffect, useCallback } from "react";
import type { ChatMessage, Conversation } from "@/types/chat";
import { chatService } from "@/services/chatService";

export function useChat(conversationId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    chatService.loadFromStorage();
    setConversations(chatService.getConversations());
  }, []);

  // Load specific conversation
  useEffect(() => {
    if (conversationId) {
      const conversation = chatService.getConversation(conversationId);
      if (conversation) {
        setCurrentConversation(conversation);
        setMessages(conversation.messages);
      }
    }
  }, [conversationId]);

  // Save to storage whenever conversations change
  useEffect(() => {
    chatService.saveToStorage();
  }, [conversations]);

  const createNewConversation = useCallback(() => {
    const newConv = chatService.createConversation();
    setConversations(chatService.getConversations());
    setCurrentConversation(newConv);
    setMessages([]);
    return newConv;
  }, []);

  const selectConversation = useCallback((id: string) => {
    const conversation = chatService.getConversation(id);
    if (conversation) {
      setCurrentConversation(conversation);
      setMessages(conversation.messages);
    }
  }, []);

  const deleteConversation = useCallback((id: string) => {
    chatService.deleteConversation(id);
    setConversations(chatService.getConversations());
    
    // If deleted conversation was current, clear it
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [currentConversation]);

  const sendMessage = useCallback(async (content: string, attachments?: any[]) => {
    // Create a new conversation if none exists
    let convId = currentConversation?.id;
    if (!convId) {
      const newConv = createNewConversation();
      convId = newConv.id;
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: "user",
      content,
      timestamp: new Date(),
      attachments,
    };

    chatService.addMessage(convId, userMessage);
    setMessages(chatService.getConversation(convId)?.messages || []);
    setConversations(chatService.getConversations());

    setIsLoading(true);

    try {
      // In a real implementation, this would call your AI backend
      // For now, simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500));

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content: generateMockResponse(content),
        timestamp: new Date(),
      };

      chatService.addMessage(convId, assistantMessage);
      setMessages(chatService.getConversation(convId)?.messages || []);
      setConversations(chatService.getConversations());
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation, createNewConversation]);

  const updateStreamingMessage = useCallback((messageId: string, content: string) => {
    if (!currentConversation) return;
    
    chatService.updateMessage(currentConversation.id, messageId, content);
    setMessages(chatService.getConversation(currentConversation.id)?.messages || []);
  }, [currentConversation]);

  const clearAllConversations = useCallback(() => {
    chatService.clearAll();
    setConversations([]);
    setCurrentConversation(null);
    setMessages([]);
  }, []);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    createNewConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
    updateStreamingMessage,
    clearAllConversations,
  };
}

function generateMockResponse(userInput: string): string {
  const responses = [
    `I understand you're asking about: "${userInput}". Based on the medical image analysis, I can provide detailed insights about the condition.

Here are some key points:
1. The image shows clear anatomical structures
2. No immediate concerns are visible
3. Further examination may be recommended

Would you like me to provide more specific information about any aspect?`,
    
    `Thank you for your question about "${userInput}". Let me analyze this for you.

**Analysis Results:**
- Overall assessment: Within normal parameters
- Key findings: Standard presentation
- Recommendations: Continue monitoring

Is there anything specific you'd like me to elaborate on?`,

    `Regarding "${userInput}", here's what I found:

\`\`\`python
# Example of medical image analysis
def analyze_image(image_path):
    result = model.predict(image_path)
    return {
        "confidence": result.confidence,
        "findings": result.findings
    }
\`\`\`

The analysis suggests standard results. Would you like more details?`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
