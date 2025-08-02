import { Server, Socket } from "socket.io";
import { createClient } from "redis";

const groupInviteListeners = (
  io: Server,
  socket: Socket,
  client: ReturnType<typeof createClient>
) => {
  socket.on(
    "send:invite",
    async ({
      to,
      from,
      conversationId,
      groupName,
      inviteId
    }: {
      to: string[];
      from: string;
      inviteId : string
      conversationId: string;
      groupName: string;
    }) => {
      if (!to || !from || !conversationId || !groupName || !inviteId) {
        socket.emit(
          "err",
          "to , from , recieverName are required to send friend request"
        );
        return;
      }

      to.forEach(async (id) => {
        const receiverSocketId = await client.hGet("users", `user:${id}`);
        console.log("emiting invite", receiverSocketId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive:invite", {
            id : inviteId,
            conversation : {
              id : conversationId,
              name : groupName
            }
          });
        }
      });
    }
  );

  socket.on("accept:invite" , ({conversationId} : {conversationId : string})=>{
    
  })
};

export default groupInviteListeners;
