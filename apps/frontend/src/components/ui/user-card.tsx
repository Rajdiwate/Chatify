import { Paper, Avatar, Typography, Box, Chip } from "@mui/material"
import { Circle } from "lucide-react"

interface UserCardProps {
  id: string
  name: string
  avatar?: string
  lastMessage?: string
  timestamp?: string
  isOnline?: boolean
  unreadCount?: number
  isSelected?: boolean
  onClick?: () => void
}

export function UserCard({
  name,
  avatar,
  lastMessage,
  timestamp,
  isOnline = false,
  unreadCount = 0,
  isSelected = false,
  onClick,
}: UserCardProps) {
  return (
    <Paper
      elevation={isSelected ? 2 : 0}
      className={`p-3 mb-2 cursor-pointer transition-all hover:bg-gray-50 ${
        isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <Box className="flex items-center gap-3">
        <div className="relative">
          <Avatar src={avatar} alt={name} className="w-12 h-12" sx={{ bgcolor: isSelected ? "#3b82f6" : "#6b7280" }}>
            {name.charAt(0).toUpperCase()}
          </Avatar>
          {isOnline && <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />}
        </div>

        <Box className="flex-1 min-w-0">
          <Box className="flex items-center justify-between mb-1">
            <Typography variant="subtitle2" className="font-semibold text-gray-900 truncate">
              {name}
            </Typography>
            {timestamp && (
              <Typography variant="caption" className="text-gray-500 text-xs">
                {timestamp}
              </Typography>
            )}
          </Box>
          {lastMessage && (
            <Typography variant="body2" className="text-gray-600 text-sm truncate">
              {lastMessage}
            </Typography>
          )}
        </Box>

        {unreadCount > 0 && (
          <Chip label={unreadCount} size="small" className="bg-blue-500 text-white text-xs min-w-[20px] h-5" />
        )}
      </Box>
    </Paper>
  )
}
