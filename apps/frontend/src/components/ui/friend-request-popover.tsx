import type React from "react"
import { useState } from "react"
import { Popover, Box, Typography, Divider, IconButton, Badge, Tooltip, Button, Alert } from "@mui/material"
import { UserPlus, X } from "lucide-react"
import { LoadingSpinner } from "../loading/loading-spinner"
import { FriendRequestCard } from "./friend-request-card"
import type { TFriendRequest } from "../../lib/redux/slices/auth/types"
import { useAppHelpers } from "../../lib/hooks/useAppHelpers"
import { acceptFriendRequestThunk } from "../../lib/redux/slices/friend/thunks"
import { onRequestAccept} from "../../lib/redux/slices/auth/AuthSlice"


interface FriendRequestPopoverProps {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  pendingRequests?: TFriendRequest[]
  isLoading?: boolean
}

export function FriendRequestPopover({
  anchorEl,
  open,
  onClose,
  pendingRequests = [],
  isLoading = false,
}: FriendRequestPopoverProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const {dispatch} = useAppHelpers()
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const handleAccept = async (id: string) => {
    console.log(id)
    setProcessingIds((prev) => new Set(prev).add(id))
    const data = await dispatch(acceptFriendRequestThunk({ senderId: id })).unwrap();
    if(data){
      setNotification({type : "success" , message : "Request accepted successfully"})
      //update the pending requests state and number of pending requests state
      dispatch(onRequestAccept(id))
    }
    else setNotification({type : "error" , message : "Something went wrong. Please try again later"})
  }

  const handleDecline = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id))
  }

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
            Friend Requests
          </Typography>
          <IconButton onClick={onClose} size="small" className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </IconButton>
        </Box>

        <Divider className="mb-4" />

        {/* Notification */}
        {notification && (
          <Alert severity={notification.type} className="mb-4" onClose={() => setNotification(null)}>
            {notification.message}
          </Alert>
        )}

        {/* Content */}
        <Box className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <Box className="flex justify-center py-8">
              <LoadingSpinner size={40} />
            </Box>
          ) : pendingRequests.length === 0 ? (
            <Box className="text-center py-8">
              <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <Typography variant="body1" className="text-gray-600 mb-2">
                No friend requests
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {"You're all caught up!"}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body2" className="text-gray-600 mb-4">
                {pendingRequests.length} pending request{pendingRequests.length !== 1 ? "s" : ""}
              </Typography>
              {pendingRequests.map((request) => (
                <FriendRequestCard
                  key={request.id}
                  {...request}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  isProcessing={processingIds.has(request.id)}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Footer */}
        {pendingRequests.length > 0 && (
          <>
            <Divider className="my-4" />
            <Box className="flex justify-center">
              <Button variant="text" className="text-blue-600 hover:text-blue-700 text-sm">
                View All Requests
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Popover>
  )
}

// Friend Request Button Component
interface FriendRequestButtonProps {
  requestCount?: number
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

export function FriendRequestButton({ requestCount = 0, onClick }: FriendRequestButtonProps) {
  return (
    <Tooltip title="Friend requests">
      <IconButton onClick={onClick} className="text-gray-200 hover:text-gray-800">
        <Badge badgeContent={requestCount} color="error" max={99}>
          <UserPlus className="w-6 h-6" />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}
