import { Box, Avatar, Typography, IconButton, Tooltip, Chip } from "@mui/material"
import { MessageCircle, UserPlus, Check, Clock, Circle } from "lucide-react"

export type UserRelationshipStatus = "friend" | "not_friend" | "request_sent" | "request_received" | "self"

interface SearchResultItemProps {
  id: string
  name: string
  username?: string
  avatar?: string
  isOnline?: boolean
  mutualFriends?: number
  relationshipStatus: UserRelationshipStatus
  onChat?: (userId: string) => void
  onAddFriend?: (userId: string) => void
  onAcceptRequest?: (userId: string) => void
  isProcessing?: boolean
}

export function SearchResultItem({
  id,
  name,
  username,
  avatar,
  isOnline = false,
  mutualFriends = 0,
  relationshipStatus,
  onChat,
  onAddFriend,
  onAcceptRequest,
  isProcessing = false,
}: SearchResultItemProps) {
  const renderActionButton = () => {
    switch (relationshipStatus) {
      case "friend":
        return (
          <Tooltip title="Send message">
            <IconButton
              onClick={() => onChat?.(id)}
              disabled={isProcessing}
              className="text-blue-600 hover:bg-blue-50"
              size="small"
            >
              <MessageCircle className="w-5 h-5" />
            </IconButton>
          </Tooltip>
        )

      case "not_friend":
        return (
          <Tooltip title="Add friend">
            <IconButton
              onClick={() => onAddFriend?.(id)}
              disabled={isProcessing}
              className="text-green-600 hover:bg-green-50"
              size="small"
            >
              <UserPlus className="w-5 h-5" />
            </IconButton>
          </Tooltip>
        )

      case "request_sent":
        return (
          <Tooltip title="Friend request sent">
            <Box className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
              <Clock className="w-4 h-4 text-gray-600" />
              <Typography variant="caption" className="text-gray-600 text-xs">
                Sent
              </Typography>
            </Box>
          </Tooltip>
        )

      case "request_received":
        return (
          <Tooltip title="Accept friend request">
            <IconButton
              onClick={() => onAcceptRequest?.(id)}
              disabled={isProcessing}
              className="text-green-600 hover:bg-green-50"
              size="small"
            >
              <Check className="w-5 h-5" />
            </IconButton>
          </Tooltip>
        )

      case "self":
        return <Chip label="You" size="small" className="bg-blue-100 text-blue-800 text-xs" />

      default:
        return null
    }
  }

  return (
    <Box className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar src={avatar} alt={name} className="w-10 h-10" sx={{ bgcolor: "#3b82f6" }}>
          {name.charAt(0).toUpperCase()}
        </Avatar>
        {isOnline && <Circle className="absolute -bottom-1 -right-1 w-3 h-3 text-green-500 fill-current" />}
      </div>

      {/* User Info */}
      <Box className="flex-1 min-w-0">
        <Typography variant="subtitle2" className="font-semibold text-gray-900 truncate">
          {name}
        </Typography>
        <Box className="flex items-center gap-2">
          {username && (
            <Typography variant="caption" className="text-gray-500">
              @{username}
            </Typography>
          )}
          {mutualFriends > 0 && relationshipStatus !== "friend" && relationshipStatus !== "self" && (
            <>
              <Typography variant="caption" className="text-gray-400">
                •
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                {mutualFriends} mutual friend{mutualFriends !== 1 ? "s" : ""}
              </Typography>
            </>
          )}
        </Box>
      </Box>

      {/* Action Button */}
      <Box className="flex-shrink-0">{renderActionButton()}</Box>
    </Box>
  )
}
