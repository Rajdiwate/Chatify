import type React from "react";
import { useState } from "react";
import { Box, Typography, Tabs, Tab, Divider } from "@mui/material";
import { UserCard } from "../ui/user-card";
import { GroupCard } from "../ui/group-card";
import { useConversation } from "../../lib/hooks/useConversation";
import { UserCardSkeleton } from "../loading/skeleton-loader";
import type { dbFriend } from "../../lib/redux/slices/conversation/types";

interface Group {
  id: string;
  name: string;
  memberCount: number;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  memberAvatars?: string[];
}

interface FriendSelectionProps {
  onSelectChat: (id: string, friend: dbFriend) => void;
  selectedChatId?: string;
}

export function FriendSelection({
  onSelectChat,
  selectedChatId,
}: FriendSelectionProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const { directConversations, loading, currentConversation } =
    useConversation();

  const groups: Group[] = [
    {
      id: "g1",
      name: "Project Team",
      memberCount: 8,
      lastMessage: "Meeting at 3 PM",
      timestamp: "30m",
      unreadCount: 5,
      memberAvatars: [
        "/placeholder.svg?height=32&width=32",
        "/placeholder.svg?height=32&width=32",
      ],
    },
    {
      id: "g2",
      name: "Family Group",
      memberCount: 6,
      lastMessage: "Dinner plans for Sunday?",
      timestamp: "2h",
      unreadCount: 0,
      memberAvatars: [
        "/placeholder.svg?height=32&width=32",
        "/placeholder.svg?height=32&width=32",
      ],
    },
    {
      id: "g3",
      name: "Study Group",
      memberCount: 12,
      lastMessage: "Notes uploaded",
      timestamp: "5h",
      unreadCount: 3,
      memberAvatars: [
        "/placeholder.svg?height=32&width=32",
        "/placeholder.svg?height=32&width=32",
      ],
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setSelectedTab(newValue);
  };

  return (
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
                  onClick={() => onSelectChat(conv.id, conv.friend)}
                />
              ))}
            </Box>
          ) : (
            <>Search For new Friend to Chat</>
          )
        ) : (
          <Box>
            <Typography
              variant="h6"
              className="text-gray-800 mb-4 font-semibold"
            >
              Groups ({groups.length})
            </Typography>
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                {...group}
                isSelected={selectedChatId === group.id}
                // onClick={() => onSelectChat("GROUP", group.id, group.name)}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
