import { Box, Paper, Typography } from "@mui/material"
import { LoadingSpinner } from "./loading-spinner"
import { ChatMessageSkeleton, UserCardSkeleton } from "./skeleton-loader"


interface ContentLoaderProps {
  type?: "spinner" | "skeleton"
  variant?: "friends" | "chat" | "general"
  count?: number
  text?: string
  className?: string
}

export function ContentLoader({
  type = "skeleton",
  variant = "general",
  count = 3,
  text,
  className = "",
}: ContentLoaderProps) {
  if (type === "spinner") {
    return (
      <Box className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <LoadingSpinner size={48} className="mb-4" />
        {text && (
          <Typography variant="body2" className="text-gray-600">
            {text}
          </Typography>
        )}
      </Box>
    )
  }

  if (variant === "friends") {
    return (
      <Box className={`p-4 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </Box>
    )
  }

  if (variant === "chat") {
    return (
      <Box className={`p-4 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <ChatMessageSkeleton key={index} isOwn={index % 3 === 0} />
        ))}
      </Box>
    )
  }

  return (
    <Box className={`p-4 space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Paper key={index} className="p-4">
          <Box className="space-y-3">
            <Box className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <Box className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <Box className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          </Box>
        </Paper>
      ))}
    </Box>
  )
}
