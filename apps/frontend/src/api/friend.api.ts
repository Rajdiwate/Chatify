import type { AxiosError } from "axios";
import type { THttpError } from "../lib/redux/slices/auth/types";
import { axiosInstance } from "../lib/axios/axiosInstance";
import type {
  TAcceptRequestResponse,
  TGetFriendsResponse,
  TSendRequestResponse,
} from "../lib/redux/slices/friend/types";

export const getFriendsRequest = async () => {
  try {
    const { data }: { data: TGetFriendsResponse } =
      await axiosInstance.get("/api/friends");
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as THttpError;
    return errorData;
  }
};

export const sendFriendRequest = async ({
  receiverId,
}: {
  receiverId: string;
}) => {
  try {
    console.log(receiverId)
    const { data } : {data : TSendRequestResponse} = await axiosInstance.post("/api/request/send", {
      receiverId,
    });
    return data
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as THttpError;
    return errorData;
  }
};

export const acceptFriendRequest = async ({
  senderId,
}: {
  senderId: string;
}) => {
  try {
    const { data }: { data: TAcceptRequestResponse } = await axiosInstance.post(
      "/api/request/accept",
      { senderId }
    );
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as THttpError;
    return errorData;
  }
};
