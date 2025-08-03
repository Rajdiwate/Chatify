import {  Box,Avatar, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Check, X } from "lucide-react";

interface GroupRequestCardProps {
  id: string;
  avatar?: string;
  conversation: {
    name: string;
    id: string;
  };
  onAccept: (id: string , conversationId : string , groupName : string) => void;
  onDecline: (id: string) => void;
  isProcessing?: boolean;
}

const GroupRequestCard = ({
  id,
  avatar,
  isProcessing = false,
  conversation,
  onAccept,
  onDecline,
}: GroupRequestCardProps) => {
  return (
    <Paper
      elevation={0}
      className="p-4 mb-3 border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <Box className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar
            src={avatar}
            className="w-12 h-12"
            sx={{ bgcolor: "#3b82f6" }}
          >
            {conversation.name.charAt(0).toUpperCase()}
          </Avatar>
        </div>
        <div className="flex-1">
          <Typography variant="h6" className="mb-1">
            {conversation.name}
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            {/* {conversation.description} */}
          </Typography>
        </div>
        <Box className="flex gap-2">
          <Tooltip title="Accept">
            <IconButton
              color="success"
              onClick={() => onAccept(id ,conversation.id , conversation.name)}
              disabled={isProcessing}
            >
              <Check className="w-6 h-6" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Decline">
            <IconButton
              color="error"
              onClick={() => onDecline(id)}
              disabled={isProcessing}
            >
              <X className="w-6 h-6" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default GroupRequestCard;
