/**
 * AIChat Page - New ChatGPT-style Interface
 * Complete redesign with modern conversational UI and MCP integration
 */

import { useState } from "react";
import { Sidebar } from "@/components/chat/Sidebar";
import { Header } from "@/components/chat/Header";
import { ChatArea } from "@/components/chat/ChatArea";
import { InputBox } from "@/components/chat/InputBox";
import { Settings } from "@/components/settings/Settings";
import { useChat } from "@/hooks/useChat";
import { useMCP } from "@/hooks/useMCP";
import type { ChatAttachment } from "@/types/chat";

export default function AIChat() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Chat hooks - first get the basic functions
  const chatHook = useChat();
  
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    createNewConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
  } = chatHook;

  // MCP hooks
  const { isAnyServerConnected } = useMCP();

  const handleNewChat = () => {
    createNewConversation();
  };

  const handleSendMessage = (content: string, attachments?: ChatAttachment[]) => {
    sendMessage(content, attachments);
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversation?.id || null}
        onSelectConversation={selectConversation}
        onNewConversation={handleNewChat}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSettings={() => setSettingsOpen(true)}
          mcpConnected={isAnyServerConnected}
        />

        {/* Chat Area */}
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          showWelcome={!currentConversation}
        />

        {/* Input Box */}
        <InputBox
          onSend={handleSendMessage}
          isDisabled={isLoading}
        />
      </div>

      {/* Settings Dialog */}
      <Settings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </div>
  );
}
