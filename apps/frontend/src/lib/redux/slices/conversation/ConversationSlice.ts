import { createSlice } from "@reduxjs/toolkit";
import type { TConversationState } from "./types";
import { acceptFriendRequestThunk, getDirectConversationThunk, getGroupConversationThunk } from "./thunks";

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
    clearCurrentDirectConversation: (state) => {
      state.currentDirectConversation = undefined;
    },
    clearCurrentGroupConversation: (state) => {
      state.currentGroupConversation = undefined;
    },
    pushtoDirectConversation: (state, action) => {
      state.directConversations.push(action.payload);
    },
    resetConversation: () => {
      return initialState;
    },
    setCurrentDirectConversation: (state, action) => {
      state.currentDirectConversation = action.payload;
    },
     setCurrentGroupConversation: (state, action) => {
      state.currentGroupConversation = action.payload;
    },
    pushMessageInDirectConvorsation: (state, action) => {
      const conversation = state.directConversations.find(
        (c) => c.id === action.payload.conversationId
      );
      conversation?.messages.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDirectConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getDirectConversationThunk.fulfilled, (state, action) => {
        state.directConversations = action.payload;
        state.loading = false;
        state.fetched = true;
      })
      .addCase(getDirectConversationThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.fetched = true;
      });

    builder
      .addCase(getGroupConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getGroupConversationThunk.fulfilled, (state, action) => {
        state.groupConversations = action.payload;
        state.loading = false;
        state.fetched = true;
      })
      .addCase(getGroupConversationThunk.rejected, (state, action) => {
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
  setCurrentGroupConversation,
  setCurrentDirectConversation,
  pushMessageInDirectConvorsation,
  clearCurrentDirectConversation,
  clearCurrentGroupConversation
} = ConversationSlice.actions;
