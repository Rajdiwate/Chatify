import { Paper, Typography, Box, Alert } from "@mui/material";
import { CustomInput } from "./custom-input";
import { CustomButton } from "./custom-button";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../lib/hooks/redux";
import { useForm } from "react-hook-form";
import type z from "zod";
import { signUpSchema } from "@chatify/zod/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupThunk } from "../../lib/redux/slices/auth/thunks";
import { useAppHelpers } from "../../lib/hooks/useAppHelpers";

export type SignupFormData = z.infer<typeof signUpSchema>;

export default function SignupForm() {
  const { loading, error } = useAppSelector((state) => state.auth);
  const {navigate , dispatch} = useAppHelpers()
  const {
    clearErrors,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormData) => {
    clearErrors();
    const temp =  await dispatch(signupThunk(data)).unwrap();
    if(temp){
      navigate("/")
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
            Create Account
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Sign up to get started
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <CustomInput
            {...register("username")}
            label="Username"
            type="text"
            required
            error={!!errors?.username}
            helperText={errors.username?.message}
            placeholder="Enter your username"
          />

          <CustomInput
            {...register("email")}
            label="Email Address"
            type="email"
            required
            error={!!errors.email}
            helperText={errors.email?.message}
            placeholder="Enter your email"
          />

          <CustomInput
            {...register("password")}
            label="Password"
            type="password"
            required
            error={!!errors.password}
            helperText={errors.password?.message}
            placeholder="Enter your password"
          />

          {errors.password && (
            <Box className="mt-2">
              <Typography variant="body2" className="text-red-600 mb-1">
                Password must:
              </Typography>
              <ul className="text-sm text-red-600 list-disc list-inside space-y-1">
                <li>{errors.password.message}</li>
              </ul>
            </Box>
          )}

          <CustomButton
            type="submit"
            loading={loading || isSubmitting}
            className="mt-6"
            disabled={isSubmitting}
          >
            Create Account
          </CustomButton>
        </form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}
