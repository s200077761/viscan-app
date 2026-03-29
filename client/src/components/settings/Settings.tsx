/**
 * Settings Component
 * Main settings dialog with tabs for different settings
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MCPSettings } from "./MCPSettings";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Settings({ open, onOpenChange }: SettingsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your ViScan AI assistant preferences and integrations
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="mcp">MCP</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="flex-1 overflow-y-auto space-y-4 mt-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle dark mode theme
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for notifications
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable smooth animations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <Label>Language</Label>
                  <select className="w-full mt-2 px-3 py-2 border rounded-lg bg-background">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Chat Settings */}
          <TabsContent value="chat" className="flex-1 overflow-y-auto space-y-4 mt-4">
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Stream Responses</Label>
                    <p className="text-sm text-muted-foreground">
                      Show AI responses as they're generated
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Code Highlighting</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable syntax highlighting for code
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Markdown Rendering</Label>
                    <p className="text-sm text-muted-foreground">
                      Render markdown in messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <Label>Temperature</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Controls randomness in responses (0 = focused, 1 = creative)
                  </p>
                  <Slider
                    defaultValue={[0.7]}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <Separator />
                
                <div>
                  <Label>Max Tokens</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Maximum length of AI responses
                  </p>
                  <Slider
                    defaultValue={[2048]}
                    max={4096}
                    min={256}
                    step={256}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* MCP Settings */}
          <TabsContent value="mcp" className="flex-1 overflow-y-auto mt-4">
            <MCPSettings />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
