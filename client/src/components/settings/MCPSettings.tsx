/**
 * MCPSettings Component
 * Configure MCP server connections
 */

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMCP } from "@/hooks/useMCP";
import { RefreshCw, CheckCircle, XCircle, Circle } from "lucide-react";

export function MCPSettings() {
  const {
    servers,
    tools,
    resources,
    prompts,
    connectionStatus,
    isInitialized,
    connect,
    disconnect,
  } = useMCP();

  const [connectingServers, setConnectingServers] = useState<Set<string>>(new Set());

  const handleToggleConnection = async (serverId: string, currentStatus: string) => {
    setConnectingServers(prev => new Set(prev).add(serverId));
    
    try {
      if (currentStatus === "connected") {
        await disconnect(serverId);
      } else {
        await connect(serverId);
      }
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setConnectingServers(prev => {
        const next = new Set(prev);
        next.delete(serverId);
        return next;
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading MCP configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* MCP Servers */}
      <div>
        <h3 className="text-lg font-semibold mb-4">MCP Servers</h3>
        <ScrollArea className="max-h-[300px]">
          <div className="space-y-3">
            {servers.length === 0 ? (
              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground">No MCP servers configured</p>
              </Card>
            ) : (
              servers.map(server => (
                <Card key={server.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(server.status)}
                      <div>
                        <p className="font-medium">{server.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {server.command} {server.args.join(" ")}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(server.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`server-${server.id}`} className="text-sm">
                      {server.status === "connected" ? "Disconnect" : "Connect"}
                    </Label>
                    <Switch
                      id={`server-${server.id}`}
                      checked={server.status === "connected"}
                      disabled={connectingServers.has(server.id)}
                      onCheckedChange={() => handleToggleConnection(server.id, server.status)}
                    />
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Available Tools */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Tools ({tools.length})</h3>
        <ScrollArea className="max-h-[200px]">
          <div className="space-y-2">
            {tools.length === 0 ? (
              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground">No tools available</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect to an MCP server to see available tools
                </p>
              </Card>
            ) : (
              tools.map((tool, idx) => (
                <Card key={idx} className="p-3">
                  <p className="font-medium text-sm">{tool.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tool.description}
                  </p>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Available Resources */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Resources ({resources.length})</h3>
        <ScrollArea className="max-h-[150px]">
          <div className="space-y-2">
            {resources.length === 0 ? (
              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground">No resources available</p>
              </Card>
            ) : (
              resources.map((resource, idx) => (
                <Card key={idx} className="p-3">
                  <p className="font-medium text-sm">{resource.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {resource.uri}
                  </p>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
