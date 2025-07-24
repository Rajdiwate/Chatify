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
import useChat from "../../lib/hooks/useChat";
import { useSocket } from "../../lib/socket/useSocket";
import { useAuth } from "../../lib/hooks/useAuth";

interface ChatBoxProps {
  chatName?: string;
  lastSeen?: string;
  chatType?: conversationType;
}

export function ChatBox({
  chatName = "Select a chat",
  lastSeen,
}: ChatBoxProps) {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const socket = useSocket();
  const { messages ,id} = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    console.log("sending message , out " , id , user , user?.username , user?.id )
    if (message.trim() && id && user && user.username && user.id) {
      console.log("sendig message , in")
      socket?.emit("send:message", {
        content: message,
        senderId: user?.id,
        senderName: user?.username,
        conversationId: id,
      });
      console.log("message sent")
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
            {chatName !== "Select a chat" && lastSeen && (
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
            {messages?.map((msg, i) => (
              <ChatMessage key={i} {...msg} />
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
