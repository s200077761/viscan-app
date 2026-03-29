/**
 * InputBox Component
 * Auto-expanding textarea for message input
 */

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatAttachment } from "@/types/chat";

const INPUT_MIN_HEIGHT = "44px";
const INPUT_MAX_HEIGHT = "200px";

interface InputBoxProps {
  onSend: (content: string, attachments?: ChatAttachment[]) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

export function InputBox({
  onSend,
  isDisabled = false,
  placeholder = "Message ViScan AI...",
}: InputBoxProps) {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;
    if (isDisabled) return;

    onSend(input, attachments.length > 0 ? attachments : undefined);
    setInput("");
    setAttachments([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map(file => ({
      type: file.type.startsWith("image/") ? "image" : "file",
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimeType: file.type,
    } as ChatAttachment));

    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment, idx) => (
              <div
                key={idx}
                className="relative flex items-center gap-2 bg-muted px-3 py-2 rounded-lg group"
              >
                <span className="text-sm text-foreground truncate max-w-[150px]">
                  {attachment.type === "image" ? "🖼️" : "📎"} {attachment.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeAttachment(idx)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          {/* File Upload */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isDisabled}
              style={{
                minHeight: INPUT_MIN_HEIGHT,
                maxHeight: INPUT_MAX_HEIGHT,
              }}
              className="resize-none pr-12 py-3"
              rows={1}
            />
            
            {/* Send Button Inside Textarea */}
            <Button
              type="submit"
              size="icon"
              disabled={(!input.trim() && attachments.length === 0) || isDisabled}
              className="absolute right-2 bottom-2 h-8 w-8"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center mt-2">
          ViScan AI can make mistakes. Verify important medical information.
        </p>
      </div>
    </div>
  );
}
