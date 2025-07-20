export type dbUser = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface IAuth {
  loading: boolean;
  error?: string;
  user?: dbUser;
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

export type THttpError = {
  success: false;
  message: string;
};
