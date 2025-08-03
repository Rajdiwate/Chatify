import { useCallback, useEffect, useRef } from "react";
import { getCurrentUserThunk } from "../redux/slices/auth/thunks";
import { logoutRequest } from "../../api/user.api";
import { resetAuth } from "../redux/slices/auth/AuthSlice";
import { useAppSelector } from "./redux";
import { useAppHelpers } from "./useAppHelpers";
import { resetConversation } from "../redux/slices/conversation/ConversationSlice";

export const useAuth = () => {
  const { loading, error, user, pendingRequests, pendingInvites } =
    useAppSelector((state) => state.auth);
  const { dispatch, navigate } = useAppHelpers();
  const isFetched = useRef(false);

  const logout = async () => {
    await logoutRequest();
    navigate("/signin");
    dispatch(resetAuth());
    dispatch(resetConversation());
  };

  const fetchUser = useCallback(() => {
    if (!isFetched.current && !user) {
      isFetched.current = true;
      dispatch(getCurrentUserThunk());
    }
  }, [dispatch, user]);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    error,
    loading,
    pendingRequests,
    pendingInvites,
    logout,
  };
};
