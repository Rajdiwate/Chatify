export interface IAuth {
  loading: boolean;
  error: string | null;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export type TSignupInput = {
  username: string;
  password: string;
  email: string;
};

export type TauthResponse = {
  user: {
    id: string;
    username: string;
    email: string;
  };
};