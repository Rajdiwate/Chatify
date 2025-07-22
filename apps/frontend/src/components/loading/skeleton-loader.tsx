import { Skeleton, Box, Paper } from "@mui/material";

interface SkeletonLoaderProps {
  variant?: "text" | "rectangular" | "circular";
  width?: number | string;
  height?: number | string;
  className?: string;
  animation?: "pulse" | "wave" | false;
}

export function SkeletonLoader({
  variant = "text",
  width,
  height,
  className = "",
  animation = "wave",
}: SkeletonLoaderProps) {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      className={className}
      sx={{
        bgcolor: "grey.200",
        "&::after": {
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        },
      }}
    />
  );
}

export function UserCardSkeleton() {
  return (
    <Paper className="p-3 mb-2">
      <Box className="flex items-center gap-3">
        <SkeletonLoader variant="circular" width={48} height={48} />
        <Box className="flex-1">
          <SkeletonLoader
            variant="text"
            width="60%"
            height={20}
            className="mb-1"
          />
          <SkeletonLoader variant="text" width="80%" height={16} />
        </Box>
        <SkeletonLoader variant="circular" width={20} height={20} />
      </Box>
    </Paper>
  );
}

export function ChatMessageSkeleton({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <Box className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
      <Box className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
        {!isOwn && (
          <SkeletonLoader
            variant="text"
            width="40%"
            height={14}
            className="mb-1"
          />
        )}
        <Paper
          className={`p-3 rounded-2xl ${isOwn ? "bg-blue-100" : "bg-gray-100"}`}
        >
          <SkeletonLoader
            variant="text"
            width="100%"
            height={16}
            className="mb-1"
          />
          <SkeletonLoader variant="text" width="70%" height={16} />
        </Paper>
        <SkeletonLoader
          variant="text"
          width="30%"
          height={12}
          className={`mt-1 ${isOwn ? "ml-auto" : ""}`}
        />
      </Box>
    </Box>
  );
}
