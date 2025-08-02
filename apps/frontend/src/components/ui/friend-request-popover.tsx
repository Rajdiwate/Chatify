import type React from "react";
import { useState } from "react";
import {
  Popover,
  Box,
  Typography,
  Divider,
  IconButton,
  Badge,
  Tooltip,
  Button,
  Alert,
} from "@mui/material";
import { Grid2x2Plus, UserPlus, X } from "lucide-react";
import { LoadingSpinner } from "../loading/loading-spinner";
import { FriendRequestCard } from "./friend-request-card";
import { useAppHelpers } from "../../lib/hooks/useAppHelpers";
import { acceptFriendRequestThunk } from "../../lib/redux/slices/conversation/thunks";
import {
  onRequestAccept,
  reducePendingReq,
} from "../../lib/redux/slices/auth/AuthSlice";
import { useSocket } from "../../lib/socket/useSocket";
import { useAuth } from "../../lib/hooks/useAuth";
import GroupRequestCard from "./group-request-card";  

interface FriendRequestPopoverProps {
  type : "DIRECT" | "GROUP",
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function FriendRequestPopover({
  type,
  anchorEl,
  open,
  onClose,
  isLoading = false,
}: FriendRequestPopoverProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const {pendingInvites , pendingRequests} = useAuth();
  const { dispatch } = useAppHelpers();
  const socket = useSocket();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleAcceptRequest = async (id: string) => {
    console.log(id);
    setProcessingIds((prev) => new Set(prev).add(id));
    const data = await dispatch(
      acceptFriendRequestThunk({ senderId: id })
    ).unwrap();
    if (data) {
      setNotification({
        type: "success",
        message: "Request accepted successfully",
      });
      //update the pending requests state and number of pending requests state
      dispatch(onRequestAccept(id));
      dispatch(reducePendingReq());
      socket?.emit("accept:request", {
        senderId: id,
        type: "DIRECT",
      });
    } else
      setNotification({
        type: "error",
        message: "Something went wrong. Please try again later",
      });
  };
  const handleAcceptInvite = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    // const data = await dispatch(
    //   acceptFriendRequestThunk({ senderId: id })
    // ).unwrap();
    // if (data) 
      if(id){
      setNotification({
        type: "success",
        message: "Request accepted successfully",
      });
      //update the pending requests state and number of pending requests state
      dispatch(onRequestAccept(id));
      dispatch(reducePendingReq());
      socket?.emit("accept:request", {
        senderId: id,
        type: "DIRECT",
      });
    } else
      setNotification({
        type: "error",
        message: "Something went wrong. Please try again later",
      });
  }

  const handleDecline = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        className: "mt-2 shadow-lg border border-gray-200",
        sx: {
          width: 400,
          maxHeight: 600,
          borderRadius: "12px",
        },
      }}
    >
      <Box className="p-4">
        {/* Header */}
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-semibold text-gray-900">
            {type === "DIRECT" ? "Friend Requests" : "Group Requests"}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </IconButton>
        </Box>

        <Divider className="mb-4" />

        {/* Notification */}
        {notification && (
          <Alert
            severity={notification.type}
            className="mb-4"
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        )}

        {/* Content */}
        <Box className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <Box className="flex justify-center py-8">
              <LoadingSpinner size={40} />
            </Box>
          ) : type === "DIRECT" && pendingRequests.length === 0 ? (
            <Box className="text-center py-8">
              <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <Typography variant="body1" className="text-gray-600 mb-2">
                No Friend requests
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {"You're all caught up!"}
              </Typography>
            </Box>
          ) : type === "GROUP" && pendingInvites.length === 0 ? (
            <Box className="text-center py-8">
              <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <Typography variant="body1" className="text-gray-600 mb-2">
                No  Group requests
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {"You're all caught up!"}
              </Typography>
            </Box>
          )
          : type === "DIRECT" && pendingRequests.length > 0 ? (
            <Box>
              <Typography variant="body2" className="text-gray-600 mb-4">
                {pendingRequests.length} pending request
                {pendingRequests.length !== 1 ? "s" : ""}
              </Typography>
              {pendingRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  {...request}
                  onAccept={handleAcceptRequest}
                  onDecline={handleDecline}
                  isProcessing={processingIds.has(request.id)}
                />
              ))}
            </Box>
          ) : type === "GROUP" && pendingInvites.length > 0 && (
            <Box>
              <Typography variant="body2" className="text-gray-600 mb-4">
                {pendingInvites.length} pending invite
                {pendingInvites.length !== 1 ? "s" : ""}
              </Typography>
              {pendingInvites.map((invite) => (
                <GroupRequestCard
                  key={invite.id}
                  {...invite}
                  onAccept={handleAcceptInvite}
                  onDecline={handleDecline}
                  isProcessing={processingIds.has(invite.id)}
                />
              ))}
            </Box>
          )

          }
        </Box>

        {/* Footer */}
        {pendingRequests.length > 0 && (
          <>
            <Divider className="my-4" />
            <Box className="flex justify-center">
              <Button
                variant="text"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                View All Requests
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Popover>
  );
}

// Friend Request Button Component
interface FriendRequestButtonProps {
  type: "DIRECT" | "GROUP";
  requestCount?: number;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export function FriendRequestButton({
  type,
  requestCount = 0,
  onClick,
}: FriendRequestButtonProps) {
  return (
    <Tooltip title={type === "DIRECT" ? "Friend Requests" : "Group Requests"}>
      <IconButton
        onClick={onClick}
        className="text-gray-200 hover:text-gray-800"
      >
        <Badge badgeContent={requestCount} color="error" max={99}>
          {type === "DIRECT" ? (
            <UserPlus className="w-6 h-6" />
          ) : (
            <Grid2x2Plus className="w-6 h-6" />
          )}
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
