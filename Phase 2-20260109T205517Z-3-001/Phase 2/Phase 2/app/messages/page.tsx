"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Send, Search, MoreVertical, Phone, Video } from "lucide-react";
import Image from "next/image";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const { user } = useAuth(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Placeholder: In real implementation, these would come from API
  useEffect(() => {
    // Mock conversations - would be replaced with API call
    const loadConversations = async () => {
      // TODO: Replace with actual API call when backend is ready
      setConversations([
        {
          id: "1",
          otherUserId: "user-1",
          otherUserName: "Tech Solutions Inc",
          lastMessage: "Thanks for your interest!",
          lastMessageTime: "2024-12-14T10:30:00Z",
          unreadCount: 2,
        },
        {
          id: "2",
          otherUserId: "user-2",
          otherUserName: "Green Energy Co",
          lastMessage: "Looking forward to the event",
          lastMessageTime: "2024-12-13T15:20:00Z",
          unreadCount: 0,
        },
      ]);
    };

    loadConversations();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedConversation) {
      // Mock messages for selected conversation - would be replaced with API call
      const loadMessages = async () => {
        // TODO: Replace with actual API call when backend is ready
        setMessages([
          {
            id: "1",
            conversationId: selectedConversation.id,
            senderId: selectedConversation.otherUserId,
            senderName: selectedConversation.otherUserName,
            content: "Hello! Thanks for reaching out.",
            timestamp: "2024-12-14T10:00:00Z",
            read: true,
          },
          {
            id: "2",
            conversationId: selectedConversation.id,
            senderId: user?.email || "",
            senderName: user?.name || "You",
            content: "I'm interested in learning more about your services.",
            timestamp: "2024-12-14T10:15:00Z",
            read: true,
          },
          {
            id: "3",
            conversationId: selectedConversation.id,
            senderId: selectedConversation.otherUserId,
            senderName: selectedConversation.otherUserName,
            content:
              "Great! I'd be happy to help. What would you like to know?",
            timestamp: "2024-12-14T10:20:00Z",
            read: true,
          },
        ]);
      };

      loadMessages();
    }
  }, [selectedConversation, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: user?.email || "",
      senderName: user?.name || "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Update last message in conversation
    setConversations(
      conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: message.timestamp,
            }
          : conv
      )
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          ⚠️ Backend not implemented yet - UI preview only
        </p>
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
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                    {conversation.otherUserImage ? (
                      <Image
                        src={conversation.otherUserImage}
                        alt={conversation.otherUserName}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      conversation.otherUserName.charAt(0)
                    )}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {conversation.otherUserName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      conversation.unreadCount > 0
                        ? "text-gray-800 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {conversation.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                  {selectedConversation.otherUserImage ? (
                    <Image
                      src={selectedConversation.otherUserImage}
                      alt={selectedConversation.otherUserName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    selectedConversation.otherUserName.charAt(0)
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {selectedConversation.otherUserName}
                  </h2>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === user?.email;
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isOwnMessage
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="px-6 py-4 border-t border-gray-200"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
