export type TFriendRequest = {
  id: string;
  username: string;
};

export type dbUser = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  pendingRequestsNumber: number;
  pendingInvitesNumber: number;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface IAuth {
  loading: boolean;
  error?: string;
  user?: dbUser;
  pendingRequests: TFriendRequest[];
  pendingInvites: TPendingInvite[];
}

export type TSigninInput = {
  password: string;
  email: string;
};
export type TSignupInput = {
  username: string;
  password: string;
  email: string;
};

export type TauthResponse = {
  success: true;
  user: dbUser;
};
export type TPendingRequestsResponse = {
  success: true;
  pendingRequests: TFriendRequest[];
};

export type THttpError = {
  success: false;
  message: string;
};
export type UserRelationshipStatus =
  | "friend"
  | "not_friend"
  | "request_sent"
  | "request_received"
  | "self";
export type searchResultUser = {
  id: string;
  username: string;
  email: string;
  relationshipStatus: UserRelationshipStatus;
};

export type searchResultResponse = {
  success: true;
  users: searchResultUser[];
};

export type TPendingInvite = {
  id: string;
  conversation: {
    name: string;
    id: string;
  };
};

export type TPendingInvitesResponse = {
  success: true;
  invites: TPendingInvite[];
}