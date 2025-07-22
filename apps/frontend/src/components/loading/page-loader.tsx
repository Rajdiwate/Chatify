import { Box, Typography, LinearProgress } from "@mui/material";
import { LoadingSpinner } from "./loading-spinner";

interface PageLoaderProps {
  text?: string;
  showProgress?: boolean;
  progress?: number;
  fullScreen?: boolean;
  className?: string;
}

export function PageLoader({
  text = "Loading...",
  showProgress = false,
  progress = 0,
  fullScreen = true,
  className = "",
}: PageLoaderProps) {
  const containerClass = fullScreen
    ? "fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50"
    : "w-full h-full";

  return (
    <Box
      className={`${containerClass} flex flex-col items-center justify-center ${className}`}
    >
      <Box className="text-center">
        {/* Logo */}
        <Typography variant="h4" className="text-blue-600 font-bold mb-8">
          ChatApp
        </Typography>

        {/* Spinner */}
        <LoadingSpinner size={60} className="mb-6" />

        {/* Loading Text */}
        <Typography variant="h6" className="text-gray-700 font-medium mb-2">
          {text}
        </Typography>

        {/* Progress Bar */}
        {showProgress && (
          <Box className="w-64 mt-4">
            <LinearProgress
              variant={progress > 0 ? "determinate" : "indeterminate"}
              value={progress}
              className="h-2 rounded-full"
              sx={{
                backgroundColor: "#e5e7eb",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#3b82f6",
                  borderRadius: "9999px",
                },
              }}
            />
            {progress > 0 && (
              <Typography
                variant="caption"
                className="text-gray-500 mt-2 block"
              >
                {Math.round(progress)}%
              </Typography>
            )}
          </Box>
        )}

        {/* Subtitle */}
        <Typography variant="body2" className="text-gray-500 mt-4 max-w-sm">
          Please wait while we prepare everything for you
        </Typography>
      </Box>
    </Box>
  );
}
