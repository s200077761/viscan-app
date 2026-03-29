/**
 * Chat Service
 * Handles chat-related API calls
 */

import type { ChatMessage, Conversation } from "@/types/chat";

class ChatService {
  private conversations: Map<string, Conversation> = new Map();

  /**
   * Get all conversations
   */
  getConversations(): Conversation[] {
    return Array.from(this.conversations.values()).sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }

  /**
   * Get a specific conversation by ID
   */
  getConversation(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  /**
   * Create a new conversation
   */
  createConversation(title: string = "New Chat"): Conversation {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const conversation: Conversation = {
      id,
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      model: "gpt-4",
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  /**
   * Update conversation title
   */
  updateConversationTitle(id: string, title: string): void {
    const conversation = this.conversations.get(id);
    if (conversation) {
      conversation.title = title;
      conversation.updatedAt = new Date();
      this.conversations.set(id, conversation);
    }
  }

  /**
   * Delete a conversation
   */
  deleteConversation(id: string): void {
    this.conversations.delete(id);
  }

  /**
   * Add a message to a conversation
   */
  addMessage(conversationId: string, message: ChatMessage): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push(message);
      conversation.updatedAt = new Date();
      
      // Auto-generate title from first user message if still "New Chat"
      if (conversation.title === "New Chat" && message.role === "user" && conversation.messages.length === 1) {
        const titlePreview = message.content.substring(0, 50);
        conversation.title = titlePreview.length < message.content.length 
          ? `${titlePreview}...` 
          : titlePreview;
      }
      
      this.conversations.set(conversationId, conversation);
    }
  }

  /**
   * Update a message in a conversation (useful for streaming)
   */
  updateMessage(conversationId: string, messageId: string, content: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      const message = conversation.messages.find(m => m.id === messageId);
      if (message) {
        message.content = content;
        conversation.updatedAt = new Date();
        this.conversations.set(conversationId, conversation);
      }
    }
  }

  /**
   * Clear all conversations
   */
  clearAll(): void {
    this.conversations.clear();
  }

  /**
   * Load conversations from localStorage
   */
  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem("viscan_conversations");
      if (stored) {
        const data = JSON.parse(stored);
        this.conversations = new Map(
          data.map((conv: any) => [
            conv.id,
            {
              ...conv,
              createdAt: new Date(conv.createdAt),
              updatedAt: new Date(conv.updatedAt),
              messages: conv.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })),
            },
          ])
        );
      }
    } catch (error) {
      console.error("Failed to load conversations from storage:", error);
    }
  }

  /**
   * Save conversations to localStorage
   */
  saveToStorage(): void {
    try {
      const data = Array.from(this.conversations.values());
      localStorage.setItem("viscan_conversations", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save conversations to storage:", error);
    }
  }
}

// Export singleton instance
export const chatService = new ChatService();
