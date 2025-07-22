import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  InputBase,
  IconButton,
  Divider,
  Avatar,
} from "@mui/material";
import { Send, Circle } from "lucide-react";
import { ChatMessage } from "../ui/chat-message";
import type { conversationType } from "../../lib/redux/slices/conversation/types";

interface ChatBoxProps {
  chatName?: string;
  lastSeen?: string;
  chatType?: conversationType;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  senderName?: string;
}

export function ChatBox({
  chatName = "Select a chat",
  lastSeen,
  chatType,
}: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey there! How are you doing?",
      timestamp: "10:30 AM",
      isOwn: false,
      senderName: chatType === "GROUP" ? "Alice" : undefined,
    },
    {
      id: "2",
      content: "I'm doing great! Thanks for asking. How about you?",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: "3",
      content: "Pretty good! Just working on some projects.",
      timestamp: "10:35 AM",
      isOwn: false,
      senderName: chatType === "GROUP" ? "Alice" : undefined,
    },
    {
      id: "4",
      content: "That sounds interesting! What kind of projects?",
      timestamp: "10:36 AM",
      isOwn: true,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box className="h-full flex flex-col bg-white">
      {/* Chat Header */}
      <Box className="p-4 border-b border-gray-200 bg-gray-50">
        <Box className="flex items-center gap-3">
          <Avatar className="w-10 h-10 bg-blue-500">
            {chatName.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" className="text-gray-900 font-semibold">
              {chatName}
            </Typography>
            {lastSeen && (
              <Box className="flex items-center gap-1">
                <Circle className="w-2 h-2 text-green-500 fill-current" />
                <Typography variant="caption" className="text-gray-500">
                  {lastSeen}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Messages Area */}
      <Box className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chatName === "Select a chat" ? (
          <Box className="h-full flex items-center justify-center">
            <Typography variant="body1" className="text-gray-500 text-center">
              Select a friend or group to start chatting
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} {...msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Message Input */}
      {chatName !== "Select a chat" && (
        <>
          <Divider />
          <Box className="p-4 bg-white">
            <Box className="flex items-center gap-2">
              <InputBase
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                multiline
                maxRows={3}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full"
                sx={{
                  "& .MuiInputBase-input": {
                    padding: "8px 0",
                  },
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
              >
                <Send className="w-5 h-5" />
              </IconButton>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
