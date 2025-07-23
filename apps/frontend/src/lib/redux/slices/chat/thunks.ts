import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { TgetMessagesResponse } from "./types";
import { getMessagesRequest } from "../../../../api/conversation";

type getMessagesInput = {
  conversationId: string;
};

export const getMessagesThunk = createAsyncThunk<
  Pick<TgetMessagesResponse , "messages" | "members">,
  getMessagesInput,
  { rejectValue: string; state: RootState }
>("/getChat", async ({ conversationId }, { rejectWithValue }) => {
  const data = await getMessagesRequest(conversationId);
  if (data.success) {
    return { members: data.members, messages: data.messages };
  } else return rejectWithValue("not implemented" + conversationId);
});
