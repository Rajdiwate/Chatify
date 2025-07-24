import { useEffect } from "react";
import { Box } from "@mui/material";
import { Header } from "../components/home/header";
import { FriendSelection } from "../components/home/friend-selection";
import { ChatBox } from "../components/home/chat-box";
import { useAuth } from "../lib/hooks/useAuth";
import { LoadingSpinner } from "../components/loading/loading-spinner";
import { useAppHelpers } from "../lib/hooks/useAppHelpers";
import type { dbFriend } from "../lib/redux/slices/conversation/types";
import { setCurrentConversation } from "../lib/redux/slices/conversation/ConversationSlice";
import { useConversation } from "../lib/hooks/useConversation";
import { getMessagesThunk } from "../lib/redux/slices/chat/thunks";
import { setConversationId } from "../lib/redux/slices/chat/ChatSlice";

export default function HomePage() {
  const { user, loading } = useAuth();
  const { currentConversation } = useConversation();
  const { dispatch } = useAppHelpers();
  const { navigate } = useAppHelpers();
  // const [selectedChat, setSelectedChat] = useState<{
  //   type: conversationType;
  //   id: string;
  //   name: string;
  // } | null>(null);

  const handleSelectChat = (id: string, friend: dbFriend) => {
    dispatch(setConversationId(id));
    dispatch(setCurrentConversation({ id, friend }));
    dispatch(getMessagesThunk({ conversationId: id }));
  };

  const getLastSeen = () => {
    // if (!selectedChat) return undefined;

    // if (selectedChat.type === "DIRECT") {
    //   return "Last seen 5 minutes ago";
    // } else {
    //   return "8 members online";
    // }
    return "Last seen 5 minutes ago";
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
          <FriendSelection onSelectChat={handleSelectChat} />
        </Box>

        {/* Right Section - Chat Box */}
        <Box className="flex-1">
          <ChatBox
            chatName={currentConversation?.friend.username}
            lastSeen={getLastSeen()}
            chatType={"DIRECT"}
          />
        </Box>
      </Box>
    </Box>
  );
}
