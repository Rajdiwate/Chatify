import { Box, Backdrop, Typography } from "@mui/material"
import { LoadingSpinner } from "./loading-spinner"

interface LoadingOverlayProps {
  open: boolean
  text?: string
  transparent?: boolean
  className?: string
}

export function LoadingOverlay({
  open,
  text = "Loading...",
  transparent = false,
  className = "",
}: LoadingOverlayProps) {
  return (
    <Backdrop
      open={open}
      className={`z-50 ${className}`}
      sx={{
        backgroundColor: transparent ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box className="flex flex-col items-center justify-center text-center">
        <LoadingSpinner size={60} color="inherit" className="mb-4" />
        <Typography variant="h6" className={`font-medium ${transparent ? "text-gray-700" : "text-white"}`}>
          {text}
        </Typography>
      </Box>
    </Backdrop>
  )
}
