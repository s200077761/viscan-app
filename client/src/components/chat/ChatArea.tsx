/**
 * ChatArea Component
 * Main chat display area with messages and typing indicator
 */

import { useEffect, useRef } from "react";
import { Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "@/types/chat";
import { Card } from "@/components/ui/card";

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  showWelcome?: boolean;
}

const SUGGESTED_PROMPTS = [
  {
    icon: "📸",
    title: "Analyze X-Ray",
    description: "Upload chest X-ray for detailed analysis",
  },
  {
    icon: "👁️",
    title: "Iris Analysis",
    description: "Analyze iris patterns for health insights",
  },
  {
    icon: "🤲",
    title: "Palm Reading",
    description: "Traditional palm analysis with AI",
  },
  {
    icon: "😊",
    title: "Face Mapping",
    description: "Facial diagnosis using TCM principles",
  },
];

export function ChatArea({ messages, isLoading = false, showWelcome = false }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1">
      <div className="max-w-4xl mx-auto px-4 py-6" ref={scrollRef}>
        {/* Welcome State */}
        {showWelcome && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2 text-foreground">
              Welcome to ViScan AI
            </h2>
            
            <p className="text-muted-foreground mb-8 max-w-md">
              Upload medical images and ask questions for AI-powered analysis
            </p>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <Card
                  key={idx}
                  className="p-4 hover:bg-accent transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{prompt.icon}</span>
                    <div className="text-left">
                      <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {prompt.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="space-y-0">
            {messages.map((message, idx) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLast={idx === messages.length - 1}
              />
            ))}
          </div>
        )}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex gap-3 py-6 px-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex gap-1.5">
                <div
                  className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Scroll Anchor */}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
