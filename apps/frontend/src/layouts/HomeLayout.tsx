import { useCallback, useEffect, type ReactNode } from "react";
import { useSocket } from "../lib/socket/useSocket";
import { useConversation } from "../lib/hooks/useConversation";
import { useAppHelpers } from "../lib/hooks/useAppHelpers";
import { addMessages } from "../lib/redux/slices/chat/ChatSlice";
import type { TChatMessage } from "../lib/redux/slices/chat/types";
import useChat from "../lib/hooks/useChat";
import { pushMessageInDirectConvorsation } from "../lib/redux/slices/conversation/ConversationSlice";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  const socket = useSocket();
  const { dispatch } = useAppHelpers();
  const { id } = useChat();
  const { directConversations } = useConversation();

  const handleSendConversations = useCallback(() => {
    const rooms = directConversations.map((c) => c.id);
    if (rooms && rooms.length) {
      socket?.emit("conversation", { rooms });
    }
  }, [directConversations, socket]);

  const handleRecieveMessages = useCallback(
    (message: TChatMessage) => {
      console.log("message received", message);
      //push the message into the current open conversation(ChatSlice) if chat is open
      console.log("checking if chat is open...");
      if (id && id === message.conversationId) {
        console.log("chat is open, adding message");
        dispatch(addMessages(message));
      }
      // push the message in the  messages array of the conversations(direct/group)
      // ws should send the type of convo as well later
      console.log("adding message in direct conversations");
      dispatch(pushMessageInDirectConvorsation(message));
    },
    [dispatch, id],
  );

  useEffect(()=>{
    handleSendConversations();
  },[directConversations, handleSendConversations])


  useEffect(() => {
    socket?.on("authenticated", handleSendConversations);
    socket?.on("receive:message", handleRecieveMessages);
    return () => {
      socket?.off("authenticated", handleSendConversations);
      socket?.off("receive:message", handleRecieveMessages);
    };
  }, [handleSendConversations, handleRecieveMessages, socket]);

  return <>{children}</>;
};

export default HomeLayout;
