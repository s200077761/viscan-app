/**
 * useMCP Hook
 * Manages MCP server connections and operations
 */

import { useState, useEffect, useCallback } from "react";
import { mcpClient } from "@/services/mcpClient";
import type { MCPServer, MCPTool, MCPResource, MCPPrompt, MCPConfig } from "@/types/mcp";

export function useMCP() {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [resources, setResources] = useState<MCPResource[]>([]);
  const [prompts, setPrompts] = useState<MCPPrompt[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, "connected" | "disconnected" | "error">>({});

  // Initialize MCP client
  const initialize = useCallback(async (config: MCPConfig) => {
    try {
      await mcpClient.initialize(config);
      setServers(mcpClient.getServers());
      setConnectionStatus(mcpClient.getConnectionStatus());
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize MCP:", error);
      throw error;
    }
  }, []);

  // Load MCP config from file
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Try to load from mcp-config.json
        const response = await fetch("/mcp-config.json");
        if (response.ok) {
          const config: MCPConfig = await response.json();
          await initialize(config);
        }
      } catch (error) {
        console.error("Failed to load MCP config:", error);
      }
    };
    loadConfig();
  }, [initialize]);

  // Connect to server
  const connect = useCallback(async (serverId: string) => {
    try {
      await mcpClient.connect(serverId);
      setServers(mcpClient.getServers());
      setConnectionStatus(mcpClient.getConnectionStatus());
      
      // Refresh available tools, resources, and prompts
      setTools(await mcpClient.listTools());
      setResources(await mcpClient.listResources());
      setPrompts(await mcpClient.listPrompts());
    } catch (error) {
      console.error(`Failed to connect to ${serverId}:`, error);
      throw error;
    }
  }, []);

  // Disconnect from server
  const disconnect = useCallback(async (serverId: string) => {
    try {
      await mcpClient.disconnect(serverId);
      setServers(mcpClient.getServers());
      setConnectionStatus(mcpClient.getConnectionStatus());
    } catch (error) {
      console.error(`Failed to disconnect from ${serverId}:`, error);
      throw error;
    }
  }, []);

  // Call a tool
  const callTool = useCallback(async (name: string, args: Record<string, any>) => {
    try {
      return await mcpClient.callTool({ name, arguments: args });
    } catch (error) {
      console.error(`Failed to call tool ${name}:`, error);
      throw error;
    }
  }, []);

  // Read a resource
  const readResource = useCallback(async (uri: string) => {
    try {
      return await mcpClient.readResource(uri);
    } catch (error) {
      console.error(`Failed to read resource ${uri}:`, error);
      throw error;
    }
  }, []);

  // Get overall connection status
  const isAnyServerConnected = Object.values(connectionStatus).some(
    status => status === "connected"
  );

  return {
    servers,
    tools,
    resources,
    prompts,
    isInitialized,
    connectionStatus,
    isAnyServerConnected,
    initialize,
    connect,
    disconnect,
    callTool,
    readResource,
  };
}
