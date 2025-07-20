import type { AxiosError } from "axios";
import type { THttpError } from "../lib/redux/slices/auth/types";
import { axiosInstance } from "../lib/axios/axiosInstance";
import type { TGetFriendsResponse } from "../lib/redux/slices/friend/types";

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
