import { Server, Socket } from "socket.io";
import { createClient } from "redis";
import { mainTopic, producer, threshold } from "..";

type TMessage = {
  conversationId: string;
  content: string;
  senderId: string;
  senderName: string;
  type : "DIRECT" | "GROUP";
};

const messageListeners = (
  io: Server,
  socket: Socket,
  client: ReturnType<typeof createClient>,
) => {
  socket.on(
    "send:message",
    async ({ conversationId, content, senderId, senderName , type }: TMessage) => {
      try {
        // Check for missing required fields
        if (!conversationId || !content || !senderId || !senderName || !type || (type !== "DIRECT" && type !== "GROUP")) {
          socket.emit(
            "err",
            "conversationId , content , senderId , senderName , type are required to send message",
          );
          return;
        } else {
          // Check if the socket is part of the room
          if (!socket.rooms.has(conversationId)) {
            socket.emit("err", "Not joined the group yet. Cannot send message");
            return;
          }
          const createdAt = new Date();
          const messageObj = {
            content,
            senderId,
            senderName,
            createdAt,
            conversationId,
          };
          const messageStr = JSON.stringify(messageObj);

          try {
            // Push the message object to Redis list
            await client.lPush(`conversation:${conversationId}`, messageStr);

            // Set Redis expiry for the conversation
            await client.expire(
              `conversation:${conversationId}`,
              3600 * 24 * 2,
            ); // 2 days
            // set the length of the array to 3*threshold to prevent infinite storage of data
            await client.lTrim(
              `conversation:${conversationId}`,
              0,
              3 * threshold - 1,
            );

            try {
              // Send the message to Kafka
              await producer.send({
                topic: mainTopic,
                messages: [
                  {
                    value: messageStr,
                    key: conversationId,
                  },
                ],
              });
              // Broadcast the message to the room
              io.to(conversationId).emit("receive:message", {...messageObj, type});
            } catch (error) {
              console.error("Error sending message to Kafka:", error);
              await client.lRem(
                `conversation:${conversationId}`,
                1,
                messageStr,
              );
              socket.emit("err", "Services down. Please try again later");
            }
          } catch (error) {
            console.error("Error pushing message to Redis:", error);
            socket.emit("err", "Services down. Please try again later");
          }
        }
      } catch (err) {
        // Log the error and emit an error event
        console.error("Error handling send:message:", err);
        socket.emit("err", "Internal server error");
      }
    },
  );
};

export default messageListeners;
