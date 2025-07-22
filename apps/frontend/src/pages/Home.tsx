import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Header } from "../components/home/header";
import { FriendSelection } from "../components/home/friend-selection";
import { ChatBox } from "../components/home/chat-box";
import { useAuth } from "../lib/hooks/useAuth";
import { LoadingSpinner } from "../components/loading/loading-spinner";
import { useAppHelpers } from "../lib/hooks/useAppHelpers";
import type { conversationType } from "../lib/redux/slices/conversation/types";

export default function HomePage() {
  const { user, loading } = useAuth();
  const { navigate } = useAppHelpers();
  const [selectedChat, setSelectedChat] = useState<{
    type: conversationType;
    id: string;
    name: string;
  } | null>(null);

  const handleSelectChat = (
    type: conversationType,
    id: string,
    name: string,
  ) => {
    console.log("Selected chat:", type, id, name);
    setSelectedChat({ type, id, name });
  };

  const getLastSeen = () => {
    if (!selectedChat) return undefined;

    if (selectedChat.type === "DIRECT") {
      return "Last seen 5 minutes ago";
    } else {
      return "8 members online";
    }
  };

  useEffect(() => {
    if (!user && !loading) {
      navigate("/signin");
    }
  }, [loading, navigate, user]);

  if (loading) {
    return <LoadingSpinner size={60} />;
  }

  return (
    <Box className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box className="flex-1 flex overflow-hidden">
        {/* Left Section - Friend Selection */}
        <Box className="w-80 border-r border-gray-200 bg-white">
          <FriendSelection
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChat?.id}
          />
        </Box>

        {/* Right Section - Chat Box */}
        <Box className="flex-1">
          <ChatBox
            chatName={selectedChat?.name}
            lastSeen={getLastSeen()}
            chatType={selectedChat?.type}
          />
        </Box>
      </Box>
    </Box>
  );
}
