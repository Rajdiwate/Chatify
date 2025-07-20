import { z } from "zod";

export const signInSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(3).max(8).trim(),
});

export const signUpSchema = z.object({
  username: z.string().trim(),
  email: z.email().trim(),
  password: z.string().min(3).max(8),
  displayname: z.string().optional(),
  phoneNumber: z.string().optional(),
});

