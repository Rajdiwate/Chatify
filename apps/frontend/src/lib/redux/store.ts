import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/AuthSlice";
import friendReducer from "./slices/friend/FriendSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
