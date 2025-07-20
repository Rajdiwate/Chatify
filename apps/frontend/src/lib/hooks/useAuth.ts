import { useCallback, useEffect } from "react";
import { useAppSelector } from "./redux";
import { useAppHelpers } from "./useAppHelpers";
import { getCurrentUserThunk } from "../redux/slices/auth/thunks";

export const useAuth = () => {
  const { loading, error, user ,pendingRequests} = useAppSelector((state) => state.auth);
  const { dispatch } = useAppHelpers();
  const fetchUserDetail = useCallback(async () => {
    await dispatch(getCurrentUserThunk()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      fetchUserDetail();
    }
  }, [user, fetchUserDetail]);

  return {
    user,
    error,
    loading,
    pendingRequests,
  };
};
