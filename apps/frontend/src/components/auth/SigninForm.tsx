import { Paper, Typography, Box, Alert } from "@mui/material";
import { CustomInput } from "./custom-input";
import { CustomButton } from "./custom-button";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../lib/hooks/redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@chatify/zod/authSchema";
import { signinThunk } from "../../lib/redux/slices/auth/thunks";
import { useAppHelpers } from "../../lib/hooks/useAppHelpers";

export type SigninFormData = z.infer<typeof signInSchema>;

export default function SigninForm() {
  const { loading, error } = useAppSelector((state) => state.auth);
  const { dispatch, navigate } = useAppHelpers();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
  } = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur", // Validate on blur for better UX
  });

  const onSubmit = async (data: SigninFormData) => {
    clearErrors();

    console.log("Form data:", data);
    const temp = await dispatch(signinThunk(data)).unwrap();
    if (temp) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Paper elevation={3} className="max-w-md w-full p-8 rounded-xl">
        <Box className="text-center mb-8">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-900 mb-2"
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Sign in to your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CustomInput
            {...register("email")}
            label="Email Address"
            type="email"
            error={!!errors.email}
            helperText={errors.email?.message}
            placeholder="Enter your email"
          />

          <CustomInput
            {...register("password")}
            label="Password"
            type="password"
            error={!!errors.password}
            helperText={errors.password?.message}
            placeholder="Enter your password"
          />

          <Box className="flex items-center justify-between mt-4">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot your password?
            </Link>
          </Box>

          <CustomButton
            type="submit"
            loading={loading || isSubmitting}
            className="mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </CustomButton>
        </form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-600">
            {"Don't have an account? "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}
