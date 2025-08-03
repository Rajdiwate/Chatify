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
  addToPendingInvites,
  addToPendingRequests,
  increasePendingInvite,
  increasePendingReq,
} from "../lib/redux/slices/auth/AuthSlice";
import { useAuth } from "../lib/hooks/useAuth";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  const socket = useSocket();
  const {user} = useAuth();
  const { dispatch } = useAppHelpers();
  const { id } = useChat();
  const { directConversations, getConversations, groupConversations } =
    useConversation();

  const handleSendConversations = useCallback(() => {
    const directIds = directConversations.map((c) => c.id);
    const groupIds = groupConversations.map((c) => c.id) || [];

    const rooms = [...directIds, ...groupIds];

    if (rooms && rooms.length) {
      socket?.emit("conversation", { rooms });
    }
  }, [directConversations, socket, groupConversations]);

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
      //push the message into the current open conversation(ChatSlice) if chat is open
      if (id && id === message.conversationId) {
        console.log("chat is open, adding message");
        dispatch(addMessages(message));
      }
      // push the message in the  messages array of the conversations(direct/group)
      // ws should send the type of convo as well later
      console.log("adding message in direct conversations");
      dispatch(pushMessageInDirectConvorsation(message));
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
          hideProgressBar: true,
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
  const handleRecieveInvite = useCallback(
    (data: {
      id: string;
      conversation: {
        name: string;
        id: string;
      };
    }) => {
      console.log("invite recieved", data);
      // increase the pending Invite count in user Slice
      // add the invite to the pending invites array in the user Slice
      dispatch(increasePendingInvite());
      dispatch(addToPendingInvites(data));
      toast.info(`Invitation from ${data.conversation.name}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
    [dispatch]
  );
  const handleAcceptInvite = useCallback(
    ({
      from,
      name,
      groupName,
    }: {
      from: string;
      name: string;
      groupName: string;
    }) => {
      console.log("invite accepted, getting conversations");
      if(user?.id === from) return
      getConversations("GROUP");
      toast.info(`${name} Joined ${groupName} group`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    },
    [getConversations , user]
  );

  useEffect(() => {
    handleSendConversations();
  }, [directConversations, handleSendConversations]);

  useEffect(() => {
    socket?.on("authenticated", handleSendConversations);
    socket?.on("receive:message", handleRecieveMessages);
    socket?.on("receive:request", handleReceiveRequest);
    socket?.on("accept:request", handleAcceptRequest);
    socket?.on("receive:invite", handleRecieveInvite);
    socket?.on("accept:invite", handleAcceptInvite);
    socket?.on("err", handleError);
    return () => {
      socket?.off("err", handleError);
      socket?.off("receive:invite", handleRecieveInvite);
      socket?.off("authenticated", handleSendConversations);
      socket?.off("receive:message", handleRecieveMessages);
      socket?.off("receive:request", handleReceiveRequest);
      socket?.off("accept:request", handleAcceptRequest);
      socket?.off("accept:invite", handleAcceptInvite);
    };
  }, [
    socket,
    handleSendConversations,
    handleRecieveMessages,
    handleError,
    handleReceiveRequest,
    handleAcceptRequest,
    handleRecieveInvite,
    handleAcceptInvite,
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
