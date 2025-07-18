import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*" }));

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

import userRoutes from "./routes/user.routes";

app.use("/api", userRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("app listening on 3000");
});
