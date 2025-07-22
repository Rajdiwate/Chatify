import { verifyJwt } from "@chatify/utils/jwt";
import { NextFunction, request, Request, Response } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookies = req.cookies;
    if (!cookies || !cookies.authToken) {
      return res.status(401).json({ success: false, message: "unauthorized" });
    }
    const decodedToken = verifyJwt(cookies.authToken);
    if (!decodedToken || !decodedToken.userId) {
      return res.status(401).json({ success: false, message: "unauthorized" });
    }
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ success: false, message: error.message });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "auth middleware" });
    }
  }
};
