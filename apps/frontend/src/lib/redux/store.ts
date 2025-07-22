import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/AuthSlice";
import ConversationReducer from "./slices/conversation/ConversationSlice";
import { friendMiddleware } from "./slices/conversation/friend.middleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conversation: ConversationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(friendMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
