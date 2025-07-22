// friendMiddleware.ts
import type { Middleware } from "@reduxjs/toolkit";

import { sendRequest } from "./ConversationSlice";
import { sendFriendRequest } from "../../../../api/friend.api";

export const friendMiddleware: Middleware = () => (next) => (action) => {
  if (sendRequest.match(action)) {
    console.log(action.payload);
    const { receiverId } = action.payload;
    sendFriendRequest({ receiverId }); // fire-and-forget
  }

  return next(action); // always call next
};
