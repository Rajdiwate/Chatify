import { Server, Socket } from "socket.io";
import { createClient } from "redis";

const conversationListeners = (
  io: Server,
  socket: Socket,
  client: ReturnType<typeof createClient>,
) => {
  socket.on("conversation", ({ rooms }: { rooms: string[] }) => {
    // optionaly -> check if the rooms are valid
    console.log("rooms", rooms);
    // join this user id to the room with the conversation id
    socket.join(rooms);
    // optionally -> save the data in redis
  });
};

export default conversationListeners;
