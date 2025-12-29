/**
 * MessageBubble Component
 * Displays individual chat messages with markdown support
 */

import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import { CodeBlock } from "@/components/common/CodeBlock";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
  isLast?: boolean;
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 py-6 px-4 group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Assistant Icon */}
      {isAssistant && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col max-w-[75%] md:max-w-[60%]",
          isUser && "items-end"
        )}
      >
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 space-y-2">
            {message.attachments.map((attachment, idx) => (
              <div key={idx}>
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-w-full rounded-lg border shadow-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      📎 {attachment.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Text Content */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {isAssistant ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const inline = !match;
                    const code = String(children).replace(/\n$/, "");

                    return !inline && match ? (
                      <CodeBlock language={match[1]} code={code} />
                    ) : (
                      <code
                        className={cn(
                          "px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-sm",
                          className
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="mb-2 ml-4 list-disc">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="mb-2 ml-4 list-decimal">{children}</ol>;
                  },
                  li({ children }) {
                    return <li className="mb-1">{children}</li>;
                  },
                  h1({ children }) {
                    return <h1 className="text-xl font-bold mb-2">{children}</h1>;
                  },
                  h2({ children }) {
                    return <h2 className="text-lg font-bold mb-2">{children}</h2>;
                  },
                  h3({ children }) {
                    return <h3 className="text-base font-bold mb-1">{children}</h3>;
                  },
                  strong({ children }) {
                    return <strong className="font-semibold">{children}</strong>;
                  },
                  a({ href, children }) {
                    return (
                      <a
                        href={href}
                        className="text-primary underline hover:no-underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
