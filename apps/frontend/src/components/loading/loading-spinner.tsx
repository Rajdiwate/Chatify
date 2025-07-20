import { CircularProgress, Box, Typography } from "@mui/material"

interface LoadingSpinnerProps {
  size?: number
  color?: "primary" | "secondary" | "inherit"
  thickness?: number
  className?: string
}

export function LoadingSpinner({ size = 40, color = "primary", thickness = 4, className = "" }: LoadingSpinnerProps) {
  return (
    <Box className={`flex items-center justify-center ${className}`}>
      <CircularProgress
        size={size}
        color={color}
        thickness={thickness}
        sx={{
          color: color === "primary" ? "#3b82f6" : undefined,
        }}
      />
    </Box>
  )
}

interface LoadingSpinnerWithTextProps extends LoadingSpinnerProps {
  text?: string
  textClassName?: string
}

export function LoadingSpinnerWithText({
  text = "Loading...",
  textClassName = "",
  ...spinnerProps
}: LoadingSpinnerWithTextProps) {
  return (
    <Box className="flex flex-col items-center justify-center gap-3">
      <LoadingSpinner {...spinnerProps} />
      <Typography variant="body2" className={`text-gray-600 font-medium ${textClassName}`}>
        {text}
      </Typography>
    </Box>
  )
}
