import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/AuthSlice";
import friendReducer from "./slices/friend/FriendSlice";
import { friendMiddleware } from "./slices/friend/friend.middleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(friendMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
