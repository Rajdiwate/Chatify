import { Button, type ButtonProps, CircularProgress } from "@mui/material"
import { forwardRef } from "react"

interface CustomButtonProps extends ButtonProps {
  loading?: boolean
}

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ loading, children, disabled, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="contained"
        fullWidth
        disabled={disabled || loading}
        className={`py-3 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors ${className || ""}`}
        sx={{
          textTransform: "none",
          fontSize: "16px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          "&:hover": {
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
          },
        }}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <CircularProgress size={20} color="inherit" />
            Loading...
          </div>
        ) : (
          children
        )}
      </Button>
    )
  },
)

CustomButton.displayName = "CustomButton"
