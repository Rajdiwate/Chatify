import { Box, Typography, Paper } from "@mui/material";

interface ChatMessageProps {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  senderName?: string;
}

export function ChatMessage({
  content,
  timestamp,
  isOwn,
  senderName,
}: ChatMessageProps) {
  return (
    <Box className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
      <Box className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
        {!isOwn && senderName && (
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
            isOwn
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
          className={`text-xs text-gray-500 mt-1 block ${isOwn ? "text-right" : "text-left"}`}
        >
          {timestamp}
        </Typography>
      </Box>
    </Box>
  );
}
