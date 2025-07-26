import { Server, Socket } from "socket.io";
import { createClient } from "redis";

const requestListener = (
  io: Server,
  socket: Socket,
  client: ReturnType<typeof createClient>
) => {
  socket.on("send:request", async ({ to, from, senderName , type } : {to:string , from : string , senderName : string , type : "DIRECT" | "GROUP"}) => {
    if (!to || !from || !senderName  || !type || (type !== "DIRECT" && type !== "GROUP")) {
      socket.emit(
        "err",
        "to , from , recieverName are required to send friend request"
      );
      return;
    }
    // find the user socket ID from redis "users" hset
    // if it exists , emit the recieve:request event to the reciever
    // else do nothing

    const receiverSocketId = await client.hGet("users", `user:${to}`);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive:request", {
        from,
        senderName,
        type
      });
    }
  });

  socket.on("accept:request", async ({ senderId , type } : {senderId : string , type : "DIRECT" | "GROUP"}) => {
    console.log("accpt rquest listened" , senderId , type);
    if(!senderId || !type || (type !== "DIRECT" && type !== "GROUP")){
      socket.emit("err", "senderId and type is required to accept friend request");
      return;
    }
    const senderSocketId = await client.hGet("users", `user:${senderId}`);
    if (senderSocketId) {
      io.to(senderSocketId).emit("accept:request" , type);
    }
  });   
};

export default requestListener;
