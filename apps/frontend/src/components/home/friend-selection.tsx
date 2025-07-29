import type React from "react";
import { useState } from "react";
import { Box, Typography, Tabs, Tab, Divider } from "@mui/material";
import { UserCard } from "../ui/user-card";
import { GroupCard } from "../ui/group-card";
import { useConversation } from "../../lib/hooks/useConversation";
import { UserCardSkeleton } from "../loading/skeleton-loader";
import type { dbFriend } from "../../lib/redux/slices/conversation/types";
import CreateGroupModal from "../ui/create-group-modal";
import { useGetGroupConversationsQuery } from "../../lib/rtk/groupApi";

interface FriendSelectionProps {
  onSelectChat: (chatInfo: {
    id: string;
    type: "GROUP" | "DIRECT";
    groupId?: string;
    groupName?: string;
    friend?: dbFriend;
  }) => void;
  selectedChatId?: string;
}
export function FriendSelection({
  onSelectChat,
  selectedChatId,
}: FriendSelectionProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const groupData = useGetGroupConversationsQuery({});
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const { directConversations, loading, currentConversation } =
    useConversation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setSelectedTab(newValue);
  };

  return (
    <>
      <Box className="h-full flex flex-col bg-white">
        {/* Header with Tabs */}
        <Box className="p-4 border-b border-gray-200">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            className="w-full"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#3b82f6",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                "&.Mui-selected": {
                  color: "#3b82f6",
                },
              },
            }}
          >
            <Tab label="Friends" className="flex-1" />
            <Tab label="Groups" className="flex-1" />
          </Tabs>
        </Box>

        <Divider />

        {/* Content */}
        <Box className="flex-1 overflow-y-auto p-4">
          {selectedTab === 0 ? (
            loading ? (
              <>
                <UserCardSkeleton />
                <UserCardSkeleton />
                <UserCardSkeleton />
              </>
            ) : directConversations && directConversations.length ? (
              <Box>
                <Typography
                  variant="h6"
                  className="text-gray-800 mb-4 font-semibold"
                >
                  Friends ({directConversations.length})
                </Typography>
                {directConversations.map((conv) => (
                  <UserCard
                    key={conv.id}
                    friend={conv.friend}
                    lastMessage={conv.messages ? conv.messages[0]?.content : ""}
                    isSelected={currentConversation?.id === conv.id}
                    onClick={() =>
                      onSelectChat({
                        type: "DIRECT",
                        id: conv.id,
                        friend: conv.friend,
                      })
                    }
                  />
                ))}
              </Box>
            ) : (
              <>Search For new Friend to Chat</>
            )
          ) : groupData.isLoading ? (
            <>
              <UserCardSkeleton />
              <UserCardSkeleton />
              <UserCardSkeleton />
            </>
          ) : (
            groupData.data && (
              <Box>
                <Typography
                  variant="h6"
                  className="text-gray-800 mb-4 font-semibold"
                >
                  Groups ({groupData.data.conversations.length}){" "}
                  <button
                    className=" mx-5 text-black px-2 rounded-full text-xl border-2"
                    onClick={() => setCreateGroupOpen(true)}
                  >
                    +
                  </button>
                </Typography>
                {groupData.data.conversations.map((group) => (
                  <GroupCard
                    key={group.id}
                    id={group.id}
                    memberCount={group.members.length}
                    name={group.groupName}
                    isSelected={selectedChatId === group.id}
                    onClick={() =>
                      onSelectChat({
                        id: group.id,
                        type: "GROUP",
                        groupId: group.id,
                        groupName: group.groupName,
                      })
                    }
                  />
                ))}
              </Box>
            )
          )}
        </Box>
      </Box>
      {createGroupOpen && (
        <CreateGroupModal
          open={createGroupOpen}
          onClose={() => setCreateGroupOpen(false)}
        />
      )}
    </>
  );
}
