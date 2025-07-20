import { Button, type ButtonProps, CircularProgress } from "@mui/material"
import { forwardRef } from "react"

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
  loadingPosition?: "start" | "end" | "center"
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, loadingText, loadingPosition = "center", children, disabled, className, ...props }, ref) => {
    const isDisabled = disabled || loading

    const renderLoadingContent = () => {
      if (!loading) return children

      const spinner = <CircularProgress size={20} color="inherit" />
      const text = loadingText || children

      if (loadingPosition === "start") {
        return (
          <div className="flex items-center gap-2">
            {spinner}
            {text}
          </div>
        )
      }

      if (loadingPosition === "end") {
        return (
          <div className="flex items-center gap-2">
            {text}
            {spinner}
          </div>
        )
      }

      return (
        <div className="flex items-center gap-2">
          {spinner}
          {loadingText || "Loading..."}
        </div>
      )
    }

    return (
      <Button ref={ref} disabled={isDisabled} className={`transition-all duration-200 ${className || ""}`} {...props}>
        {renderLoadingContent()}
      </Button>
    )
  },
)

LoadingButton.displayName = "LoadingButton"
