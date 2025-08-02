import { createServer } from "http";
import { Server } from "socket.io";
import { parse } from "cookie";
import conversationListeners from "./listeners/conversation.listeners";
import { verifyJwt } from "@chatify/utils/jwt";
import { createClient } from "redis";
import { Kafka, Partitioners } from "kafkajs";
import messageListeners from "./listeners/message.listner";
import { config } from "dotenv";
import requestListener from "./listeners/friendRequest.listener";
import groupInviteListeners from "./listeners/groupInvite.listener";

config();

const httpServer = createServer();
export const client: ReturnType<typeof createClient> = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});
export const producer = new Kafka({
  clientId: "chatify",
  brokers: [process.env.KAFKA_URL || "localhost:9092"],
}).producer({
  allowAutoTopicCreation: true,
  idempotent: true,
  createPartitioner: Partitioners.LegacyPartitioner,
});
export const mainTopic = process.env.NMAIN_TOPIC || "persist";
export const threshold = Number(process.env.LENGTH_THRESHOLD) || 20;

const init = async () => {
  await client
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect()
    .then(() => console.log("redis connected"));
  await producer
    .connect()
    .then(() => console.log("kafka connected"))
    .catch((err) => console.log("failed to connect to kafka producer", err));
};

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  if (socket.handshake.headers.cookie) {
    if (parse(socket.handshake.headers.cookie).authToken) {
      const token = parse(socket.handshake.headers.cookie).authToken;
      if (token) {
        try {
          const decodedToken = verifyJwt(token);

          if (decodedToken && decodedToken.userId) {
            socket.emit("authenticated", decodedToken);
            client.hSet("users", `user:${decodedToken.userId}`, socket.id);
            // for better performance use a revermap of socker.id -> userID
          } else {
            console.log("token not valid");
            socket.disconnect();
          }
        } catch (error) {
          console.log(error instanceof Error ? error.message : "invalid token");
          socket.disconnect();
        }
      } else {
        console.log("cookie not found");
        socket.disconnect();
      }
    } else {
      console.log("cookie not found");
      socket.disconnect();
    }
  } else {
    console.log("cookie not found");
    socket.disconnect();
  }

  //listners
  conversationListeners(io, socket, client);
  messageListeners(io, socket, client);
  requestListener(io, socket, client);
  groupInviteListeners(io, socket, client);

  socket.on("disconnect", async () => {
    // find the user based on the socket Id in redis , and remove it
    const users = await client.hGetAll("users");
    Object.entries(users).forEach(async element => {
        if(element[1] === socket.id){
          await client.hDel("users", element[0]);
        }
    });

    console.log("a user disconnected");
  });
});

init()
  .then(() => {
    httpServer.listen(3001);
  })
  .catch(() => {
    console.log("cannor connect to redis");
    process.exit(1);
  });
