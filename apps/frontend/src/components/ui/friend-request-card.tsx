import { Paper, Avatar, Typography, Box, IconButton, Tooltip } from "@mui/material"
import { Check, Circle, X } from "lucide-react"

interface FriendRequestCardProps {
  id: string
  username: string
  email : string
  avatar?: string
  mutualFriends?: number
  timestamp?: string
  isOnline?: boolean
  bio?: string
  onAccept: (id: string) => void
  onDecline: (id: string) => void
  isProcessing?: boolean
}

export function FriendRequestCard({
  id,
  username,
  avatar,
  mutualFriends = 0,
  timestamp,
  isOnline = false,
  bio,
  onAccept,
  onDecline,
  isProcessing = false,
}: FriendRequestCardProps) {
  return (
    <Paper elevation={0} className="p-4 mb-3 border border-gray-200 hover:bg-gray-50 transition-colors">
      <Box className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar src={avatar} className="w-12 h-12" sx={{ bgcolor: "#3b82f6" }}>
            {username.charAt(0).toUpperCase()}
          </Avatar>
          {isOnline && <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />}
        </div>

        {/* Content */}
        <Box className="flex-1 min-w-0">
          <Box className="flex items-start justify-between mb-1">
            <Typography variant="subtitle2" className="font-semibold text-gray-900 truncate">
              {username}
            </Typography>
            {timestamp && (
              <Typography variant="caption" className="text-gray-500 text-xs flex-shrink-0 ml-2">
                {timestamp}
              </Typography>
            )}
          </Box>

          {/* Bio */}
          {bio && (
            <Typography variant="body2" className="text-gray-600 text-sm mb-2 line-clamp-2">
              {bio}
            </Typography>
          )}

          {/* Mutual Friends */}
          {mutualFriends > 0 && (
            <Typography variant="caption" className="text-gray-500 text-xs mb-3 block">
              {mutualFriends} mutual friend{mutualFriends !== 1 ? "s" : ""}
            </Typography>
          )}

          {/* Action Buttons */}
          <Box className="flex items-center gap-2">
            <Tooltip title="Accept friend request">
              <IconButton
                onClick={() => onAccept(id)}
                disabled={isProcessing}
                className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 transition-colors"
                size="small"
              >
                <Check className="w-4 h-4" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Decline friend request">
              <IconButton
                onClick={() => onDecline(id)}
                disabled={isProcessing}
                className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 transition-colors"
                size="small"
              >
                <X className="w-4 h-4" />
              </IconButton>
            </Tooltip>

            <Typography variant="body2" className="text-gray-600 text-sm ml-2">
              wants to be friends
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
