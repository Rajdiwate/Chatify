import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/AuthSlice";
import conversationReducer from "./slices/conversation/ConversationSlice";
import chatReducer from "./slices/chat/ChatSlice";
import { friendMiddleware } from "./slices/conversation/friend.middleware";
import { groupApi } from "../rtk/groupApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    chat: chatReducer,
    [groupApi.reducerPath]: groupApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(friendMiddleware).concat(groupApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
