import type { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios/axiosInstance";
import type { SigninFormData } from "../components/auth/SigninForm";
import type { TauthResponse, THttpError } from "../lib/redux/slices/auth/types";
import type { SignupFormData } from "../components/auth/SignupForm";

export const signInRequest = async function (reqData: SigninFormData) {
  try {
    const { data }: { data: TauthResponse } = await axiosInstance.post(
      "/api/signin",
      reqData
    );
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as THttpError;
    return errorData;
  }
};

export const signUpRequest = async function (reqData: SignupFormData) {
  try {
    const { data }: { data: TauthResponse } = await axiosInstance.post(
      "/api/signup",
      reqData
    );
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as THttpError;
    return errorData;
  }
};

export const getCurrentUserRequest = async function () {
  try {
    const { data }: { data: TauthResponse } =
      await axiosInstance.get("/api/me");
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as THttpError;
    return errorData;
  }
};
