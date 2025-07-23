import { Box, Typography, Paper } from "@mui/material";
import type { TChatMessage } from "../../lib/redux/slices/chat/types";
import { useAuth } from "../../lib/hooks/useAuth";

export function ChatMessage({ content, senderId , senderName , createdAt }: TChatMessage) {
  const {user} = useAuth()
  return (
    <Box className={`flex mb-4 ${(user?.id === senderId) ? "justify-end" : "justify-start"}`}>
      <Box className={`max-w-[70%] ${(user?.id === senderId) ? "order-2" : "order-1"}`}>
        {!(user?.id === senderId) && senderName && (
          <Typography
            variant="caption"
            className="text-gray-500 text-xs mb-1 block"
          >
            {senderName}
          </Typography>
        )}
        <Paper
          elevation={1}
          className={`p-3 rounded-2xl ${
            (user?.id === senderId)
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 rounded-bl-md"
          }`}
        >
          <Typography variant="body2" className="break-words">
            {content}
          </Typography>
        </Paper>
        <Typography
          variant="caption"
          className={`text-xs text-gray-500 mt-1 block ${(user?.id === senderId) ? "text-right" : "text-left"}`}
        >
          {createdAt.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}
