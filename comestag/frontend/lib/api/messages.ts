import { authenticatedGet, authenticatedPost, authenticatedPut } from "./api-client";
import { logger } from "@/lib/logger";
import { getAccessToken } from "../secure-storage";
import { isDevMode } from "../dev-auth";

// Message types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  content: string;
  timestamp: string;
  read: boolean;
  readAt?: string;
}

export interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserImage?: string;
  otherUserType?: "ORGANIZATION" | "CONSUMER";
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSenderId?: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListResponse {
  content: Conversation[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface MessageListResponse {
  content: Message[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface SendMessageRequest {
  conversationId?: string; // Optional - will create new conversation if not provided
  recipientId: string;
  content: string;
}

export interface CreateConversationRequest {
  recipientId: string;
  initialMessage?: string;
}

// Message endpoints
const MESSAGE_ENDPOINTS = {
  CONVERSATIONS: "/v1/messages/conversations",
  CONVERSATION: (id: string) => `/v1/messages/conversations/${id}`,
  MESSAGES: (conversationId: string) => `/v1/messages/conversations/${conversationId}/messages`,
  SEND: "/v1/messages/send",
  MARK_READ: (conversationId: string) => `/v1/messages/conversations/${conversationId}/read`,
  STREAM: "/v1/messages/stream",
} as const;

// Backend returns PageResult format
interface PageResult<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/**
 * Get list of conversations
 */
export async function getConversations(params?: {
  page?: number;
  size?: number;
  search?: string;
}): Promise<{
  success: boolean;
  data?: Conversation[];
  message?: string;
}> {
  try {
    logger.info("Fetching conversations", params);
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append("page", params.page.toString());
    if (params?.size !== undefined) queryParams.append("size", params.size.toString());
    if (params?.search) queryParams.append("search", params.search);

    const endpoint = `${MESSAGE_ENDPOINTS.CONVERSATIONS}${queryParams.toString() ? `?${queryParams}` : ""}`;
    const result = await authenticatedGet<PageResult<Conversation>>(endpoint);
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.items,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch conversations",
    };
  } catch (error) {
    logger.error("Error fetching conversations", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch conversations",
    };
  }
}

/**
 * Get a specific conversation by ID
 */
export async function getConversation(
  conversationId: string
): Promise<{
  success: boolean;
  data?: Conversation;
  message?: string;
}> {
  try {
    logger.info("Fetching conversation", { conversationId });
    return authenticatedGet<Conversation>(MESSAGE_ENDPOINTS.CONVERSATION(conversationId));
  } catch (error) {
    logger.error("Error fetching conversation", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch conversation",
    };
  }
}

/**
 * Get messages for a conversation
 */
export async function getMessages(
  conversationId: string,
  params?: {
    page?: number;
    size?: number;
  }
): Promise<{
  success: boolean;
  data?: Message[];
  message?: string;
}> {
  try {
    logger.info("Fetching messages", { conversationId, params });
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append("page", params.page.toString());
    if (params?.size !== undefined) queryParams.append("size", params.size.toString());

    const endpoint = `${MESSAGE_ENDPOINTS.MESSAGES(conversationId)}${queryParams.toString() ? `?${queryParams}` : ""}`;
    const result = await authenticatedGet<PageResult<Message>>(endpoint);
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.items,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch messages",
    };
  } catch (error) {
    logger.error("Error fetching messages", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch messages",
    };
  }
}

/**
 * Send a message
 */
export async function sendMessage(
  data: SendMessageRequest
): Promise<{
  success: boolean;
  data?: Message;
  message?: string;
}> {
  try {
    logger.info("Sending message", { conversationId: data.conversationId, recipientId: data.recipientId });
    const result = await authenticatedPost<Message>(MESSAGE_ENDPOINTS.SEND, {
      conversationId: data.conversationId,
      recipientId: data.recipientId,
      content: data.content,
    });
    if (result.success && result.data) {
      // Map backend response to frontend format
      return {
        success: true,
        data: {
          id: result.data.id,
          conversationId: result.data.conversationId,
          senderId: result.data.senderId,
          senderName: result.data.senderName,
          content: result.data.content,
          timestamp: result.data.timestamp,
          read: result.data.read,
          readAt: result.data.readAt,
        },
      };
    }
    return result;
  } catch (error) {
    logger.error("Error sending message", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send message",
    };
  }
}

/**
 * Create a new conversation
 */
export async function createConversation(
  data: CreateConversationRequest
): Promise<{
  success: boolean;
  data?: Conversation;
  message?: string;
}> {
  try {
    logger.info("Creating conversation", { recipientId: data.recipientId });
    return authenticatedPost<Conversation>(MESSAGE_ENDPOINTS.CONVERSATIONS, data);
  } catch (error) {
    logger.error("Error creating conversation", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create conversation",
    };
  }
}

/**
 * Mark messages in a conversation as read
 */
export async function markConversationAsRead(
  conversationId: string
): Promise<{
  success: boolean;
  message?: string;
}> {
  // Skip in dev mode
  if (isDevMode()) {
    logger.debug("🔧 [DEV MODE] Skipping mark conversation as read");
    return { success: true };
  }

  try {
    logger.info("Marking conversation as read", { conversationId });
    const response = await authenticatedPut(MESSAGE_ENDPOINTS.MARK_READ(conversationId));
    return {
      success: response.success,
      message: response.message,
    };
  } catch (error) {
    // Log as debug since this is not critical - conversation will still work
    logger.debug("Error marking conversation as read", { error: error instanceof Error ? error.message : String(error) });
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to mark conversation as read",
    };
  }
}

/**
 * Connect to real-time message stream using authenticated fetch (for SSE with auth)
 * @param onMessage Callback when a new message is received
 * @param onError Callback when an error occurs
 * @returns AbortController (call .abort() to disconnect)
 */
export function connectMessageStreamAuthenticated(
  onMessage: (message: Message, conversationId: string) => void,
  onError?: (error: Error) => void
): AbortController | null {
  // In dev mode, return null (no real-time connection)
  if (isDevMode()) {
    logger.info("🔧 [DEV MODE] Skipping real-time message stream connection");
    return null;
  }

  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (typeof window !== "undefined"
        ? "" // Use relative paths when served from same origin
        : "http://localhost:3000"); // SSR fallback

    const token = getAccessToken();
    if (!token) {
      logger.error("Cannot connect to message stream: No access token");
      return null;
    }

    const url = `${API_BASE_URL}${MESSAGE_ENDPOINTS.STREAM}`;
    logger.info("Connecting to authenticated message stream", { url });

    const abortController = new AbortController();

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
      signal: abortController.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`SSE connection failed: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body reader available");
        }

        let buffer = "";
        let eventType = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) {
              // Empty line indicates end of event, process if we have data
              continue;
            }
            
            if (trimmedLine.startsWith("event: ")) {
              eventType = trimmedLine.slice(7).trim();
            } else if (trimmedLine.startsWith("data: ")) {
              try {
                const dataStr = trimmedLine.slice(6);
                const data = JSON.parse(dataStr);
                
                if (eventType === "new_message" || eventType === "message_sent") {
                  const messageData = data.message || data;
                  if (messageData && messageData.id) {
                    const message: Message = {
                      id: messageData.id,
                      conversationId: messageData.conversationId || data.conversationId,
                      senderId: messageData.senderId,
                      senderName: messageData.senderName || "Unknown",
                      senderImage: messageData.senderImage,
                      content: messageData.content,
                      timestamp: messageData.timestamp,
                      read: messageData.read || false,
                      readAt: messageData.readAt,
                    };
                    onMessage(message, message.conversationId);
                  }
                } else if (eventType === "connected") {
                  logger.info("Connected to message stream");
                } else if (eventType === "heartbeat") {
                  // Ignore heartbeat
                }
              } catch (e) {
                logger.error("Error parsing SSE data", e, { line: trimmedLine });
              }
            }
          }
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          logger.error("Error in message stream", error);
          if (onError) {
            onError(error);
          }
        }
      });

    return abortController;
  } catch (error) {
    logger.error("Error connecting to message stream", error);
    if (onError) {
      onError(error as Error);
    }
    return null;
  }
}
