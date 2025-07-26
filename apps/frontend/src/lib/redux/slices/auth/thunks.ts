import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  dbUser,
  TFriendRequest,
  TPendingInvite,
  TSigninInput,
  TSignupInput,
} from "./types";
import type { RootState } from "../../store";
import {
  getCurrentUserRequest,
  getPendingRequestsRequest,
  signInRequest,
  signUpRequest,
} from "../../../../api/user.api";
import { getPendingInvitesRequest } from "../../../../api/group";

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

export const getPendingRequestsThunk = createAsyncThunk<
  TFriendRequest[],
  void,
  { rejectValue: string; state: RootState }
>("/pendingRequests", async (_, { rejectWithValue }) => {
  const data = await getPendingRequestsRequest();
  if (data.success) {
    return data.pendingRequests;
  } else return rejectWithValue(data.message);
});

export const getPendingInvitesThunk = createAsyncThunk<
  TPendingInvite[],
  void,
  { rejectValue: string; state: RootState }
>("/pendingInvites", async (_, { rejectWithValue }) => {
  const data = await getPendingInvitesRequest();
  if (data.success) {
    return data.invites;
  } else return rejectWithValue(data.message);
})
