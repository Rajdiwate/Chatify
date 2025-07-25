import { Server, Socket } from "socket.io";
import { createClient } from "redis";
import { producer } from "..";

const messageListeners = (
  io: Server,
  socket: Socket,
  client: ReturnType<typeof createClient>
) => {
  socket.on(
    "send:message",
    async ({
      conversationId,
      content,
      senderId,
      senderName,
    }: {
      conversationId: string;
      content: string;
      senderId: string;
      senderName: string;
    }) => {
      try {
        // Log the incoming message data
        console.log("sending message", {
          conversationId,
          content,
          senderId,
          senderName,
        });

        // Check for missing required fields
        if (!conversationId || !content || !senderId || !senderName) {
          socket.emit(
            "err",
            "conversationId , content , senderId , senderName are required to send message"
          );
        } else {
          // Check if the socket is part of the room
          if (!socket.rooms.has(conversationId)) {
            console.log(socket.rooms, conversationId);
            console.log("not joined the group yet. Cannot send message");
            socket.emit("err", "Not joined the group yet. Cannot send message");
          }

          // Push the message object to Redis list
          await client.lPush(
            `conversation:${conversationId}`,
            JSON.stringify({
              content,
              senderId,
              senderName,
              createdAt: new Date(Date.now()),
              conversationId,
            })
          );

          // Set Redis expiry for the conversation
          await client.expire(`conversation:${conversationId}`, 3600 * 24 * 2); // 2 days
          // Send the message to Kafka
          await producer.send({
            topic: "persist",
            messages : [
              {
                value: JSON.stringify({
                  content,
                  senderId,
                  senderName,
                  createdAt: new Date(Date.now()),
                  conversationId,
                }),
                key: conversationId
              },
              
            ]
          });
          // Broadcast the message to the room
          io.to(conversationId).emit("receive:message", {
            content,
            senderId,
            senderName,
            createdAt: new Date(Date.now()),
            conversationId,
          });
        }
      } catch (err) {
        // Log the error and emit an error event
        console.error("Error handling send:message:", err);
        socket.emit("err", "Internal server error");
      }
    }
  );
};

export default messageListeners;
