import { TextField, type TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

interface CustomInputProps extends Omit<TextFieldProps, "variant"> {
  error?: boolean;
  helperText?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ error, helperText, className, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant="outlined"
        fullWidth
        error={error}
        helperText={helperText}
        className={`mb-4 ${className || ""}`}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3b82f6",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#3b82f6",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#3b82f6",
          },
        }}
        {...props}
      />
    );
  },
);

CustomInput.displayName = "CustomInput";
