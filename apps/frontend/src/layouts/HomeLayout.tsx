import { useCallback, useEffect, type ReactNode } from "react";
import { useSocket } from "../lib/socket/useSocket";
import { useConversation } from "../lib/hooks/useConversation";
import { useAppHelpers } from "../lib/hooks/useAppHelpers";
import { addMessages } from "../lib/redux/slices/chat/ChatSlice";
import type { TChatMessage } from "../lib/redux/slices/chat/types";
import useChat from "../lib/hooks/useChat";
import { pushMessageInDirectConvorsation } from "../lib/redux/slices/conversation/ConversationSlice";
import { Bounce, toast, ToastContainer } from "react-toastify";
import {
  addToPendingRequests,
  increasePendingReq,
} from "../lib/redux/slices/auth/AuthSlice";
import { groupApi, useGetGroupConversationsQuery } from "../lib/rtk/groupApi";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  const socket = useSocket();
  const { dispatch } = useAppHelpers();
  const { id } = useChat();
  const { directConversations, getConversations } = useConversation();
  const groupData = useGetGroupConversationsQuery();

  const handleSendConversations = useCallback(() => {
    const directIds = directConversations.map((c) => c.id);
    const groupIds = groupData.data?.conversations?.map((c) => c.id) || [];

    const rooms = [...directIds, ...groupIds];

    if (rooms && rooms.length) {
      socket?.emit("conversation", { rooms });
    }
  }, [directConversations, socket, groupData.data?.conversations]);

  const handleRecieveMessages = useCallback(
    (message: TChatMessage) => {
      console.log("message received", message);

      if (!message.type) {
        toast.error("No  messagge type recieved", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }
      if (message.type === "DIRECT") {
        //push the message into the current open conversation(ChatSlice) if chat is open
        if (id && id === message.conversationId) {
          console.log("chat is open, adding message");
          dispatch(addMessages(message));
        }
        // push the message in the  messages array of the conversations(direct/group)
        // ws should send the type of convo as well later
        console.log("adding message in direct conversations");
        dispatch(pushMessageInDirectConvorsation(message));
      } else {
        console.log("addming message to group");
        dispatch(
          groupApi.util.updateQueryData(
            "getGroupMessages",
            { conversationId: message.conversationId },
            (data) => {
              return {
                ...data,
                messages: [...data.messages, message],
              };
            }
          )
        );
      }
    },
    [dispatch, id]
  );
  const handleError = useCallback((message: string) => {
    toast.error(message ?? "Internal Server Error", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    console.log("error received", message);
  }, []);
  const handleReceiveRequest = useCallback(
    ({
      from,
      senderName,
      type,
    }: {
      from: string;
      senderName: string;
      type: "DIRECT" | "GROUP";
    }) => {
      if (type === "DIRECT") {
        dispatch(increasePendingReq());
        dispatch(addToPendingRequests({ id: from, username: senderName }));
        toast.info(`${senderName} sent you a friend request`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        console.log("type is not DIRECT", type);
      }
    },
    [dispatch]
  );
  const handleAcceptRequest = useCallback(
    (type: "DIRECT" | "GROUP") => {
      console.log("request accepted, getting conversations");
      getConversations(type);
    },
    [getConversations]
  );

  useEffect(() => {
    handleSendConversations();
  }, [directConversations, handleSendConversations]);

  useEffect(() => {
    socket?.on("authenticated", handleSendConversations);
    socket?.on("receive:message", handleRecieveMessages);
    socket?.on("receive:request", handleReceiveRequest);
    socket?.on("accept:request", handleAcceptRequest);
    socket?.on("err", handleError);
    return () => {
      socket?.off("err", handleError);
      socket?.off("authenticated", handleSendConversations);
      socket?.off("receive:message", handleRecieveMessages);
      socket?.off("receive:request", handleReceiveRequest);
      socket?.off("accept:request", handleAcceptRequest);
    };
  }, [
    handleSendConversations,
    handleRecieveMessages,
    socket,
    handleError,
    handleReceiveRequest,
    handleAcceptRequest,
  ]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {children}
    </>
  );
};

export default HomeLayout;
