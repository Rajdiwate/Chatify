import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { acceptFriendRequest } from "../../../../api/friend.api";
import type { conversationType, TDirectConversation } from "./types";
import { getConversationRequest } from "../../../../api/conversation";

export const getConversationThunk = createAsyncThunk<
  TDirectConversation[],
  conversationType,
  { rejectValue: string; state: RootState }
>("/getFriends", async (type, { rejectWithValue }) => {
  const data = await getConversationRequest(type);
  if (data.success) {
    return data.conversations;
  } else return rejectWithValue(data.message);
});

export const acceptFriendRequestThunk = createAsyncThunk<
  TDirectConversation,
  { senderId: string },
  { rejectValue: string; state: RootState }
>("/request/accept", async ({ senderId }, { rejectWithValue }) => {
  const data = await acceptFriendRequest({ senderId });
  if (data.success) {
    return data.conversation;
  } else return rejectWithValue(data.message);
});
