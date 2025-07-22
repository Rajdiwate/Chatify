import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

type getChatInput = {
  conversationId: string;
};

export const getChatThunk = createAsyncThunk<
  string,
  getChatInput,
  { rejectValue: string; state: RootState }
>("/getChat", ({ conversationId }, { rejectWithValue }) => {
  return rejectWithValue("not implemented" + conversationId);
});
