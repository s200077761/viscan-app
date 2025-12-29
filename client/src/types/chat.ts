/**
 * Chat Types
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  attachments?: ChatAttachment[];
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
}

export interface ChatAttachment {
  type: "image" | "file";
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  model?: string;
}

export interface ChatSettings {
  model: string;
  temperature?: number;
  maxTokens?: number;
  streamResponses?: boolean;
  enableMCP?: boolean;
}

export type MessageRole = "user" | "assistant" | "system";
