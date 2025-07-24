import type { dbUser } from "../auth/types";
import type { TChatMessage } from "../chat/types";

export type dbFriend = {
  id: string;
  username: string;
  email: string;
};

export type conversationType = "DIRECT" | "GROUP";

export type TDirectConversation = {
  id: string;
  friend: dbFriend;
  messages: TChatMessage[];
};

export type TGroupConversation = {
  id: string;
  groupName: string;
  members: {
    user: Pick<dbUser, "id" | "username" | "email">;
  }[];
  messages: TChatMessage[];
};

export type TConversationState = {
  loading: boolean;
  error?: string;
  fetched: boolean;
  groupConversations: TGroupConversation[];
  directConversations: TDirectConversation[];
  currentConversation?: TDirectConversation;
};

export type TGetConversationResponse = {
  success: true;
  conversations: TDirectConversation[];
};

export type TAcceptRequestResponse = {
  success: true;
  conversation: TDirectConversation;
};

export type TSendRequestResponse = {
  success: true;
  friendRequest: unknown;
};

export type TGetFriendsResponse = {
  success: true;
  friends: dbFriend[];
};
