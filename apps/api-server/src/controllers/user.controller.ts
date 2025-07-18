import { prisma } from "@chatify/db";
import { comparePassword, hashPassword } from "@chatify/utils/bcrypt";
import { signJwt } from "@chatify/utils/jwt";
import { signInSchema, signUpSchema } from "@chatify/zod/authSchema";
import { NextFunction, Request, Response } from "express";

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = signInSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Details" });
    }

    // check if user exists in db
    const user = await prisma.user.findUnique({
      where: { email: parsedData.data.email },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "No such user" });
    }

    //compare hashed password and input password
    const isValidPassword = await comparePassword(
      user.passwordHash,
      parsedData.data.password
    );
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect credentials" });
    }

    // user exists --> gnerate token and send in cookies
    const authToken = signJwt({ userId: user.id });

    return res
      .status(200)
      .cookie("authToken", authToken, {
        sameSite: true,
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS (in production)
      })
      .json({ success: true, user });
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

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsedData = signUpSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect Details" });
    }

    // hash the password
    const hashedPassword = await hashPassword(parsedData.data.password);
    // save user in db
    const displayname = parsedData.data.displayname;
    const phoneNumber = parsedData.data.phoneNumber;

    const dataToSave: {
      email: string;
      passwordHash: string;
      username: string;
      displayname?: string;
      phoneNumber?: string;
    } = {
      email: parsedData.data.email,
      passwordHash: hashedPassword,
      username: parsedData.data.username,
    };
    if (displayname) dataToSave["displayname"] = displayname;
    if (phoneNumber) dataToSave["phoneNumber"] = phoneNumber;

    const user = await prisma.user.create({
      data: dataToSave,
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to save user" });
    }
    // user exists --> gnerate token and send in cookies
    const authToken = signJwt({ userId: user.id });

    return res
      .status(200)
      .cookie("authToken", authToken, {
        sameSite: true,
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS (in production)
      })
      .json({ success: true, user });
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

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId as string;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "No such user" });
    }

    return res.status(200).json({ success: true, user });
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
