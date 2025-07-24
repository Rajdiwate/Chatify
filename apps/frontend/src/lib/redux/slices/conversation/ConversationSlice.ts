import { createSlice } from "@reduxjs/toolkit";
import type { TConversationState } from "./types";
import { acceptFriendRequestThunk, getConversationThunk } from "./thunks";

const initialState: TConversationState = {
  loading: false,
  directConversations: [],
  groupConversations: [],
  fetched: false,
};

export const ConversationSlice = createSlice({
  name: "Conversation",
  initialState,
  reducers: {
    sendRequest: (_, action) => {
      console.log("req-sent to", action.payload);
    },
    pushtoDirectConversation: (state, action) => {
      state.directConversations.push(action.payload);
    },
    resetConversation: () => {
      return initialState;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    pushMessageInDirectConvorsation: (state, action) => {
      const conversation = state.directConversations.find(
        (c) => c.id === action.payload.conversationId
      );
      // ?.messages?.push(action.payload);
      conversation?.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getConversationThunk.fulfilled, (state, action) => {
        state.directConversations = action.payload;
        state.loading = false;
        state.fetched = true;
      })
      .addCase(getConversationThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.fetched = true;
      });

    builder
      .addCase(acceptFriendRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(acceptFriendRequestThunk.fulfilled, (state, action) => {
        state.directConversations.push(action.payload);
        state.loading = false;
      })
      .addCase(acceptFriendRequestThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default ConversationSlice.reducer;
export const {
  sendRequest,
  pushtoDirectConversation,
  resetConversation,
  setCurrentConversation,
  pushMessageInDirectConvorsation,
} = ConversationSlice.actions;
