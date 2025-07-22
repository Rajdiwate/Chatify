import type { dbUser } from "../auth/types";

export type TChatState = {
  loading: boolean;
  error?: string;
  id?: string;
  messages?: TChatMessage[];
  members?: Pick<dbUser, "id" | "username" | "email">[];
};

export type TChatMessage = {
  id: string;
  sender: Pick<dbUser, "id" | "username" | "email">;
  content: string;
};
