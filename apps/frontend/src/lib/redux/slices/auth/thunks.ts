import { createAsyncThunk } from "@reduxjs/toolkit";
import type { dbUser, TSigninInput, TSignupInput } from "./types";
import type { RootState } from "../../store";
import {
  getCurrentUserRequest,
  signInRequest,
  signUpRequest,
} from "../../../../api/auth.api";

export const signupThunk = createAsyncThunk<
  dbUser,
  TSignupInput,
  { rejectValue: string; state: RootState }
>("/signup", async ({ email, password, username }, { rejectWithValue }) => {
  const data = await signUpRequest({ email, password, username });
  if (data.success) {
    return data.user;
  } else {
    return rejectWithValue(data.message);
  }
});

export const signinThunk = createAsyncThunk<
  dbUser,
  TSigninInput,
  { rejectValue: string; state: RootState }
>("/signin", async ({ email, password }, { rejectWithValue }) => {
  const data = await signInRequest({ email, password });
  if (data.success) {
    return data.user;
  } else {
    return rejectWithValue(data.message);
  }
});

export const getCurrentUserThunk = createAsyncThunk<
  dbUser,
  void,
  { rejectValue: string; state: RootState }
>("/me", async (_, { rejectWithValue }) => {
  const data = await getCurrentUserRequest();
  if (data.success) {
    return data.user;
  } else return rejectWithValue(data.message);
});
