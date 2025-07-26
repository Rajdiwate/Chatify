import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createClient } from "redis";

export const client: ReturnType<typeof createClient> = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const init = async () => {
  await client
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect()
    .then(() => console.log("redis connected"));
};

import userRoutes from "./routes/user.routes";
import requestRoute from "./routes/request.route";
import convoRoutes from "./routes/conversation.route";
import messageRoutes from "./routes/message.route";
import groupRoutes from "./routes/group.routes";
import { errorMiddleware } from "./middleware/error.middleware";

app.use("/api", userRoutes);
app.use("/api/request", requestRoute);
app.use("/api", convoRoutes);
app.use("/api", messageRoutes);
app.use("/api", groupRoutes);

app.use(errorMiddleware);

init()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("app listening on 3000");
    });
  })
  .catch((err) => console.log(err));

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
