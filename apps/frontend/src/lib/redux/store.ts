import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/AuthSlice";
import conversationReducer from "./slices/conversation/ConversationSlice";
import chatReducer from "./slices/chat/ChatSlice";
import { friendMiddleware } from "./slices/conversation/friend.middleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: conversationReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(friendMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
