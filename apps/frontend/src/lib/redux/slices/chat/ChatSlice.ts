import { createSlice } from "@reduxjs/toolkit";
import type { TChatState } from "./types";
import { getMessagesThunk } from "./thunks";

const initialState: TChatState = {
  loading: false,
  type: "DIRECT",
};

export const ChatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {
    setConversationId: (state, action) => {
      console.log("setting COnsersation Id", action.payload);
      state.id = action.payload;
    },
    addMessages: (state, action) => {
      state.messages?.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessagesThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.messages = action.payload.messages;
        state.members = action.payload.members;
        if (action.payload.messages.length > 2) {
          state.type = "GROUP";
        } else {
          state.type = "DIRECT";
        }
      })
      .addCase(getMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ChatSlice.reducer;
export const { addMessages, setConversationId } = ChatSlice.actions;
