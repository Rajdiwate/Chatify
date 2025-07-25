import { createServer } from "http";
import { Server } from "socket.io";
import { parse } from "cookie";
import conversationListeners from "./listeners/conversation.listeners";
import { verifyJwt } from "@chatify/utils/jwt";
import { createClient } from "redis";
import { Kafka, Partitioners } from "kafkajs";
import messageListeners from "./listeners/message.listner";

const httpServer = createServer();
export const client : ReturnType<typeof createClient> = createClient({ url: "redis://127.0.0.1:6379" });
export const producer = new Kafka({
  clientId: "chatify",
  brokers: ["localhost:9092"],
}).producer({allowAutoTopicCreation: true , idempotent: true , createPartitioner: Partitioners.LegacyPartitioner });

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
          socket.emit("authenticated", decodedToken);
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

  socket.on("disconnect", () => {
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
