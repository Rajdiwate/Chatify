import { createSlice } from "@reduxjs/toolkit";
import type { TChatState } from "./types";

const initialState: TChatState = {
  loading: false,
};

export const ChatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {
    setConversationId: (state, action) => {
      state.id = action.payload;
    },
  },
});

export default ChatSlice.reducer;
