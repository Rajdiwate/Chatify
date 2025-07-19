import { createAsyncThunk } from "@reduxjs/toolkit";
import type { TauthResponse, TSignupInput } from "./types";
import type { RootState } from "../../store";

export const signupThunk = createAsyncThunk<
  TauthResponse,
  TSignupInput,
  { rejectValue: string; state: RootState }
>("/signup", async ({ email, password, username }, { rejectWithValue }) => {
  const data = "";
  return rejectWithValue(data);
});