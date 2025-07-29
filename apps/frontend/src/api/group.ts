import type { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios/axiosInstance";
import type {
  THttpError,
  TPendingInvitesResponse,
} from "../lib/redux/slices/auth/types";

export const getPendingInvitesRequest = async function name() {
  try {
    const { data }: { data: TPendingInvitesResponse } = await axiosInstance.get(
      "/api/group/invites/pending"
    );
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as THttpError;
    return errorData;
  }
};


