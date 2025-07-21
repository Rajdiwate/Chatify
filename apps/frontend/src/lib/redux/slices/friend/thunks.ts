import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import {
  acceptFriendRequest,
  getFriendsRequest,
} from "../../../../api/friend.api";
import type { friends } from "./types";

export const getFriendsThunk = createAsyncThunk<
  friends,
  void,
  { rejectValue: string; state: RootState }
>("/getFriends", async (_, { rejectWithValue }) => {
  const data = await getFriendsRequest();
  if (data.success) {
    return data.friends;
  } else return rejectWithValue(data.message);
});

export const acceptFriendRequestThunk = createAsyncThunk<
  friends,
  { senderId: string },
  { rejectValue: string; state: RootState }
>("/request/accept", async ({ senderId }, { rejectWithValue }) => {
  const data = await acceptFriendRequest({ senderId });
  if (data.success) {
    return data.friends;
  } else return rejectWithValue(data.message);
});
