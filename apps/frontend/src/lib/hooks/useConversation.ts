import { useCallback, useEffect } from "react";
import { useAppSelector } from "./redux";
import { useAppHelpers } from "./useAppHelpers";
import { getConversationThunk } from "../redux/slices/conversation/thunks";
import type { conversationType } from "../redux/slices/conversation/types";

export const useConversation = () => {
  const { loading, error, directConversations, groupConversations, fetched } =
    useAppSelector((state) => state.conversation);
  const { dispatch } = useAppHelpers();
  const { user } = useAppSelector((state) => state.auth);

  const getConversations = useCallback(
    async (type: conversationType) => {
      dispatch(getConversationThunk(type));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!fetched && user) {
      getConversations("DIRECT"); //default direct. later store the current tab in session and get it from there
    }
  }, [getConversations, fetched, user]);

  return {
    loading,
    error,
    directConversations,
    groupConversations,
    getConversations,
  };
};
