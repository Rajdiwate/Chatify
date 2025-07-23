import { useCallback, useEffect, type ReactNode } from "react";
import { useSocket } from "../lib/socket/useSocket";
import { useConversation } from "../lib/hooks/useConversation";
import { useAppHelpers } from "../lib/hooks/useAppHelpers";
import { addMessages } from "../lib/redux/slices/chat/ChatSlice";
import type { TChatMessage } from "../lib/redux/slices/chat/types";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  const socket = useSocket();
  const {dispatch} = useAppHelpers();
  const { directConversations } = useConversation();

  const handleSendConversations = useCallback(() => {
    const rooms = directConversations.map((c) => c.id);
    socket?.emit("conversations" , rooms)
  }, [directConversations , socket]);

  const handleRecieveMessages = useCallback((message : TChatMessage) => {
    console.log("message received" , message)
    dispatch(addMessages(message))
  }, [dispatch]);

  useEffect(() => {
    socket?.on("authenticated", handleSendConversations);
    socket?.on("receive:message" , handleRecieveMessages);
    return () => {
      socket?.off("authenticated", handleSendConversations);
      socket?.off("receive:message" , handleRecieveMessages);
    };
  }, [handleSendConversations, handleRecieveMessages, socket]);

  return <>{children}</>;
};

export default HomeLayout;
