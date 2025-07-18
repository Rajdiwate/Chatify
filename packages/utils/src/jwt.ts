import { config } from "dotenv";
import jwt from "jsonwebtoken";
config();

export const signJwt = function ({ userId }: { userId: string }): String {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  return token;
};

export const verifyJwt = function (token: string) {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
  if (typeof decodedToken === "string") {
    return null;
  }
  return decodedToken;
};
