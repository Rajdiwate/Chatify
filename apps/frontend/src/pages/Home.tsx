import { useEffect, useState } from "react";
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
import { useLazyGetGroupMessagesQuery, type TGroup } from "../lib/rtk/groupApi";

export default function HomePage() {
  const { user, loading } = useAuth();
  const { currentConversation } = useConversation();
  const [getGroupMessages , groupMessageData] = useLazyGetGroupMessagesQuery();
  const [currentGroup, setCurrentGroup] = useState<TGroup>();
  const { dispatch } = useAppHelpers();
  const { navigate } = useAppHelpers();
  const [selectedTab, setSelectedTab] = useState(0);
  const handleSelectChat = ({
    id,
    type,
    group,
    friend,
  }: {
    id: string;
    type: "GROUP" | "DIRECT";
    group?: TGroup;
    friend?: dbFriend;
  }) => {
    if (type === "DIRECT") {
      dispatch(setConversationId(id));
      setCurrentGroup(undefined);
      dispatch(setCurrentConversation({ id, friend }));
      dispatch(getMessagesThunk({ conversationId: id }));
    } else {
      dispatch(setConversationId(id));
      getGroupMessages({conversationId : id});
      console.log("current group", group);
      setCurrentGroup(group);
    }
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
          <FriendSelection onSelectChat={handleSelectChat} setSelectedTab={setSelectedTab} selectedTab={selectedTab}  />
        </Box>

        {/* Right Section - Chat Box */}
        <Box className="flex-1">
          <ChatBox
            chatName={selectedTab === 1 ? currentGroup?.groupName :  currentConversation?.friend.username  }
            lastSeen={getLastSeen()}
            chatType={ selectedTab === 0 ? "DIRECT" : "GROUP"}
            group={currentGroup}
            groupMessages = {groupMessageData.data?.messages}
          />
        </Box>
      </Box>
    </Box>
  );
}
