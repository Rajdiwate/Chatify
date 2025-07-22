import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

import userRoutes from "./routes/user.routes";
import requestRoute from "./routes/request.route";
import convoRoutes from "./routes/conversation.route";
import { errorMiddleware } from "./middleware/error.middleware";

app.use("/api", userRoutes);
app.use("/api/request", requestRoute);
app.use("/api", convoRoutes);

app.use(errorMiddleware);

app.listen(process.env.PORT || 3000, () => {
  console.log("app listening on 3000");
});
