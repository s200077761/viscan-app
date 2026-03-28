import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Plus,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Menu,
  X,
  Bot,
  User as UserIcon,
} from "lucide-react";
import { APP_LOGO } from "@/const";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: "image" | "file";
    url: string;
    name: string;
  }>;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, _setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() && selectedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      attachments: selectedFiles.map(file => ({
        type: file.type.startsWith("image/") ? "image" : "file",
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setSelectedFiles([]);
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    // This is a placeholder. In production, this would call your AI backend
    const responses = [
      `I understand you're asking about: "${userInput}". Based on the medical image analysis, I can provide detailed insights about the condition.`,
      `Thank you for your question. Let me analyze the medical data you've provided. The results show...`,
      `I've processed your request regarding "${userInput}". Here are the findings from the AI analysis...`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    setSelectedFiles([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 border-r bg-muted/30 flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b">
          <Button
            onClick={handleNewChat}
            className="w-full gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {conversations.map(conv => (
              <Card
                key={conv.id}
                className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                  currentConversationId === conv.id ? "bg-accent" : ""
                }`}
                onClick={() => setCurrentConversationId(conv.id)}
              >
                <div className="font-medium text-sm truncate">{conv.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {conv.lastMessage}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">{user?.name || "User"}</p>
            <p>Free Plan • 5/5 analyses left</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <img src={APP_LOGO} alt="ViScan" className="h-8 w-8" />
            <div>
              <h1 className="font-semibold">ViScan AI Assistant</h1>
              <p className="text-xs text-muted-foreground">
                Medical Image Analysis & Diagnosis
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome to ViScan AI
                </h2>
                <p className="text-muted-foreground mb-8">
                  Upload medical images and ask questions for AI-powered
                  analysis
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <h3 className="font-medium mb-2">📸 Analyze X-Ray</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload chest X-ray for detailed analysis
                    </p>
                  </Card>
                  <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <h3 className="font-medium mb-2">👁️ Iris Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Analyze iris patterns for health insights
                    </p>
                  </Card>
                  <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <h3 className="font-medium mb-2">🤲 Palm Reading</h3>
                    <p className="text-sm text-muted-foreground">
                      Traditional palm analysis with AI
                    </p>
                  </Card>
                  <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <h3 className="font-medium mb-2">😊 Face Mapping</h3>
                    <p className="text-sm text-muted-foreground">
                      Facial diagnosis using TCM principles
                    </p>
                  </Card>
                </div>
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mb-2 space-y-2">
                        {message.attachments.map((attachment, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden">
                            {attachment.type === "image" ? (
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="max-w-full h-auto rounded-lg"
                              />
                            ) : (
                              <div className="flex items-center gap-2 p-2 bg-background/50 rounded">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">
                                  {attachment.name}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            const inline =
                              !props.node ||
                              props.node.position?.start.line ===
                                props.node.position?.end.line;
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <UserIcon className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto">
            {selectedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg"
                  >
                    {file.type.startsWith("image/") ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    <span className="text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(idx)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileSelect}
              />

              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about medical images..."
                className="flex-1"
              />

              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() && selectedFiles.length === 0}
                size="icon"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
              ViScan AI can make mistakes. Verify important medical information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
