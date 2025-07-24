import type { AxiosError } from "axios";
import type { THttpError } from "../lib/redux/slices/auth/types";
import { axiosInstance } from "../lib/axios/axiosInstance";
import type {
  conversationType,
  TGetConversationResponse,
} from "../lib/redux/slices/conversation/types";
import type { TgetMessagesResponse } from "../lib/redux/slices/chat/types";

export const getConversationRequest = async (type: conversationType) => {
  try {
    const { data }: { data: TGetConversationResponse } =
      await axiosInstance.post("/api/conversation", { type });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as THttpError;
    return errorData;
  }
};

export const getMessagesRequest = async (conversationId: string) => {
  try {
    const { data }: { data: TgetMessagesResponse } = await axiosInstance.post(
      `/api/messages`,
      { conversationId },
    );
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as THttpError;
    return errorData;
  }
};
