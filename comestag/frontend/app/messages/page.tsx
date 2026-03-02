"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Send, Search, MoreVertical, Phone, Video, Plus } from "lucide-react";
import Image from "next/image";
import {
  getConversations,
  getMessages,
  sendMessage,
  markConversationAsRead,
  connectMessageStreamAuthenticated,
  type Conversation,
  type Message,
} from "@/lib/api/messages";
import { mockApiResponse, mockConversations, mockMessages } from "@/lib/dev-mock-api";
import { isDevMode } from "@/lib/dev-auth";
import { logger } from "@/lib/logger";

export default function MessagesPage() {
  const { user } = useAuth(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageStreamAbortController = useRef<AbortController | null>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      // Mark conversation as read when selected (skip in dev mode or if backend unavailable)
      if (!isDevMode()) {
        markConversationAsRead(selectedConversation.id).catch((error) => {
          // Silently fail - this is not critical for functionality
          logger.debug("Failed to mark conversation as read", error);
        });
      }
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to real-time message stream
  useEffect(() => {
    if (isDevMode()) {
      // In dev mode, use polling as fallback
      if (!selectedConversation) return;

      const interval = setInterval(() => {
        loadMessages(selectedConversation.id, false); // Silent refresh
      }, 5000);

      return () => clearInterval(interval);
    }

    // Connect to real-time SSE stream
    const abortController = connectMessageStreamAuthenticated(
      (message, conversationId) => {
        // If this message is for the currently selected conversation, add it
        if (selectedConversation && conversationId === selectedConversation.id) {
          setMessages((prev) => {
            // Check if message already exists (avoid duplicates)
            if (prev.some((m) => m.id === message.id)) {
              return prev;
            }
            return [...prev, message];
          });
        }

        // Update conversation list to show new message
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: message.content,
                  lastMessageTime: message.timestamp,
                  lastMessageSenderId: message.senderId,
                  unreadCount:
                    selectedConversation?.id === conversationId
                      ? 0
                      : conv.unreadCount + 1,
                }
              : conv
          )
        );
      },
      (error) => {
        logger.error("Message stream error", error);
        // Fallback to polling on error
        if (selectedConversation) {
          const interval = setInterval(() => {
            loadMessages(selectedConversation.id, false);
          }, 5000);
          return () => clearInterval(interval);
        }
      }
    );

    messageStreamAbortController.current = abortController;

    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [selectedConversation, user]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      
      // Filter conversations by search query if provided
      let filtered = mockConversations;
      if (searchQuery) {
        filtered = mockConversations.filter((conv) =>
          conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      const result = await mockApiResponse(
        () => getConversations({ page: 0, size: 50, search: searchQuery || undefined }),
        filtered
      );

      if (result.success && result.data) {
        setConversations(result.data);
      }
    } catch (error) {
      logger.error("Error loading conversations", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string, showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);

      // In dev mode, use mock messages
      if (isDevMode() && mockMessages[conversationId]) {
        const mockMessagesForConv = mockMessages[conversationId];
        // Sort by timestamp
        const sortedMessages = [...mockMessagesForConv].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sortedMessages);
        if (showLoading) setIsLoading(false);
        return;
      }

      const result = await mockApiResponse(
        () => getMessages(conversationId, { page: 0, size: 100 }),
        mockMessages[conversationId] || []
      );

      if (result.success && result.data) {
        setMessages(result.data);
      }
    } catch (error) {
      logger.error("Error loading messages", error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    // Optimistically add message to UI
    const currentUserId = user?.email || "dev@test.com";
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      senderName: user?.name || "You",
      senderImage: "",
      content: messageContent,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const result = await mockApiResponse(
        () =>
          sendMessage({
            conversationId: selectedConversation.id,
            recipientId: selectedConversation.otherUserId,
            content: messageContent,
          }),
        {
          ...tempMessage,
          id: `msg-${Date.now()}`,
          read: false,
        }
      );

      if (result.success && result.data) {
        // Replace temp message with real one
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempMessage.id ? result.data! : msg))
        );

        // Update conversation list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  lastMessage: messageContent,
                  lastMessageTime: result.data!.timestamp,
                  lastMessageSenderId: result.data!.senderId,
                  unreadCount: 0,
                }
              : conv
          )
        );
      } else {
        // Remove temp message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
        alert(result.message || "Failed to send message");
      }
    } catch (error) {
      logger.error("Error sending message", error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      if (diffInMinutes < 1) return "Just now";
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update conversations when search query changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadConversations();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!user) {
    return null; // useAuth hook handles loading/redirect
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
            <p className="text-sm text-gray-500 mt-1">
              Connect and communicate with other organizations
            </p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && conversations.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No conversations found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start a new conversation to begin messaging
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedConversation?.id === conversation.id ? "bg-blue-50 border-l-4 border-l-primary" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                      {conversation.otherUserImage ? (
                        <Image
                          src={conversation.otherUserImage}
                          alt={conversation.otherUserName}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      ) : (
                        conversation.otherUserName.charAt(0).toUpperCase()
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left overflow-hidden min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {conversation.otherUserName}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {conversation.lastMessageTime && formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        conversation.unreadCount > 0
                          ? "text-gray-800 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {conversation.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                  {selectedConversation.otherUserImage ? (
                    <Image
                      src={selectedConversation.otherUserImage}
                      alt={selectedConversation.otherUserName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    selectedConversation.otherUserName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {selectedConversation.otherUserName}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.otherUserType === "ORGANIZATION"
                      ? "Organization"
                      : "Consumer"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Call"
                >
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Video call"
                >
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="More options"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
            >
              {isLoading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const currentUserId = user?.email || "dev@test.com";
                  const isOwnMessage = 
                    message.senderId === currentUserId || 
                    message.senderId === "dev@test.com" ||
                    (isDevMode() && message.senderName === user?.name && message.senderName === "Test Organization");
                  const showDateSeparator =
                    index === 0 ||
                    new Date(message.timestamp).toDateString() !==
                      new Date(messages[index - 1].timestamp).toDateString();

                  return (
                    <div key={message.id}>
                      {showDateSeparator && (
                        <div className="flex items-center justify-center my-4">
                          <div className="bg-gray-200 h-px flex-1"></div>
                          <span className="px-3 text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <div className="bg-gray-200 h-px flex-1"></div>
                        </div>
                      )}
                      <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            isOwnMessage
                              ? "bg-primary text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                          }`}
                        >
                          {!isOwnMessage && (
                            <p className="text-xs font-semibold mb-1 text-gray-600">
                              {message.senderName}
                            </p>
                          )}
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwnMessage ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                            {isOwnMessage && message.read && (
                              <span className="ml-1">✓✓</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="px-6 py-4 border-t border-gray-200 bg-white"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
