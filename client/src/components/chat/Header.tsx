/**
 * Header Component
 * Top bar with menu toggle, model selector, and settings
 */

import { Menu, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { APP_LOGO } from "@/const";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  mcpConnected: boolean;
}

const MODELS = [
  { id: "gpt-4", name: "GPT-4", description: "Most capable" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Faster & cheaper" },
  { id: "viscan-medical", name: "ViScan Medical", description: "Medical specialist" },
];

export function Header({ onToggleSidebar, onOpenSettings, mcpConnected }: HeaderProps) {
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo & Title */}
        <div className="flex items-center gap-2">
          <img src={APP_LOGO} alt="ViScan" className="h-8 w-8" />
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-foreground">ViScan AI</h1>
            <p className="text-xs text-muted-foreground">Medical Assistant</p>
          </div>
        </div>
      </div>

      {/* Center Section - Model Selector */}
      <div className="flex-1 flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 max-w-[200px]"
            >
              <span className="truncate">{selectedModel.name}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-[240px]">
            <DropdownMenuLabel>Select Model</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {MODELS.map(model => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className="flex flex-col items-start py-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium">{model.name}</span>
                  {selectedModel.id === model.id && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {model.description}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* MCP Status Indicator */}
        {mcpConnected && (
          <Badge variant="outline" className="gap-1 hidden sm:flex">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs">MCP</span>
          </Badge>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
