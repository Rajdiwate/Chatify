import {
  Paper,
  Avatar,
  Typography,
  Box,
  Chip,
  AvatarGroup,
} from "@mui/material";
import { Users } from "lucide-react";

interface GroupCardProps {
  id: string;
  name: string;
  memberCount: number;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isSelected?: boolean;
  memberAvatars?: string[];
  onClick?: () => void;
}

export function GroupCard({
  name,
  memberCount,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isSelected = false,
  memberAvatars = [],
  onClick,
}: GroupCardProps) {
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
          {memberAvatars.length > 0 ? (
            <AvatarGroup max={2} className="w-12 h-12">
              {memberAvatars.slice(0, 2).map((avatar, index) => (
                <Avatar key={index} src={avatar} className="w-8 h-8" />
              ))}
            </AvatarGroup>
          ) : (
            <Avatar className="w-12 h-12 bg-purple-500">
              <Users className="w-6 h-6" />
            </Avatar>
          )}
        </div>

        <Box className="flex-1 min-w-0">
          <Box className="flex items-center justify-between mb-1">
            <Typography
              variant="subtitle2"
              className="font-semibold text-gray-900 truncate"
            >
              {name}
            </Typography>
            {timestamp && (
              <Typography variant="caption" className="text-gray-500 text-xs">
                {timestamp}
              </Typography>
            )}
          </Box>
          <Typography variant="caption" className="text-gray-500 text-xs mb-1">
            {memberCount} members
          </Typography>
          {lastMessage && (
            <Typography
              variant="body2"
              className="text-gray-600 text-sm truncate"
            >
              {lastMessage}
            </Typography>
          )}
        </Box>

        {unreadCount > 0 && (
          <Chip
            label={unreadCount}
            size="small"
            className="bg-purple-500 text-white text-xs min-w-[20px] h-5"
          />
        )}
      </Box>
    </Paper>
  );
}
