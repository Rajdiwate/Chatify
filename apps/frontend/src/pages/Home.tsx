import { useState } from "react"
import { Box } from "@mui/material"
import { Header } from "../components/home/header"
import { FriendSelection } from "../components/home/friend-selection"
import { ChatBox } from "../components/home/chat-box"

export default function HomePage() {
  const [selectedChat, setSelectedChat] = useState<{
    type: "friend" | "group"
    id: string
    name: string
  } | null>(null)

  const handleSelectChat = (type: "friend" | "group", id: string, name: string) => {
    setSelectedChat({ type, id, name })
  }

  const getLastSeen = () => {
    if (!selectedChat) return undefined

    if (selectedChat.type === "friend") {
      return "Last seen 5 minutes ago"
    } else {
      return "8 members online"
    }
  }

  return (
    <Box className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <Box className="flex-1 flex overflow-hidden">
        {/* Left Section - Friend Selection */}
        <Box className="w-80 border-r border-gray-200 bg-white">
          <FriendSelection onSelectChat={handleSelectChat} selectedChatId={selectedChat?.id} />
        </Box>

        {/* Right Section - Chat Box */}
        <Box className="flex-1">
          <ChatBox chatName={selectedChat?.name} lastSeen={getLastSeen()} chatType={selectedChat?.type} />
        </Box>
      </Box>
    </Box>
  )
}
