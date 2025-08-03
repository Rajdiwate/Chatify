import { useCallback, useEffect, useRef } from "react";
import { useAppSelector } from "./redux";
import { useAppHelpers } from "./useAppHelpers";
import {
  getDirectConversationThunk,
  getGroupConversationThunk,
} from "../redux/slices/conversation/thunks";
import type { conversationType } from "../redux/slices/conversation/types";

export const useConversation = () => {
  const {
    loading,
    error,
    directConversations,
    groupConversations,
    currentDirectConversation,
    currentGroupConversation,
  } = useAppSelector((state) => state.conversation);
  const { dispatch } = useAppHelpers();
  const { user } = useAppSelector((state) => state.auth);
  const fetching = useRef(false);

  const getConversations = useCallback(
    async (type: conversationType) => {
      if (type !== "DIRECT" && type !== "GROUP") return;
      else if (type === "GROUP") dispatch(getGroupConversationThunk(type));
      else dispatch(getDirectConversationThunk(type));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!fetching.current && user) {
      fetching.current = true;
      getConversations("DIRECT"); //default direct. later store the current tab in session and get it from there
    }
  }, [getConversations, user]);

  return {
    loading,
    error,
    currentDirectConversation,
    currentGroupConversation,
    directConversations,
    groupConversations,
    getConversations,
  };
};
