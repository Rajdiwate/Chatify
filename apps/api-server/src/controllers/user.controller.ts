import { prisma } from "@chatify/db";
import { comparePassword, hashPassword } from "@chatify/utils/bcrypt";
import { signJwt } from "@chatify/utils/jwt";
import { signInSchema, signUpSchema } from "@chatify/zod/authSchema";
import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const signin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = signInSchema.safeParse(req.body);
    console.log(req.body);
    if (!parsedData.success) {
      throw new AppError("Incorrect Details", 400);
    }

    // check if user exists in db
    const user = await prisma.user.findUnique({
      where: { email: parsedData.data.email },
      include: { receivedFriendRequests: { where: { status: "PENDING" } } },
    });

    if (!user) {
      throw new AppError("No such User exists", 404);
    }

    //compare hashed password and input password
    const isValidPassword = await comparePassword(
      user.passwordHash,
      parsedData.data.password,
    );
    if (!isValidPassword) {
      throw new AppError("Incorrect credentials", 400);
    }

    const pendingRequestsNumber = user.receivedFriendRequests.length;
    const { receivedFriendRequests, ...userWithoutPendingReqs } = user;

    // user exists --> gnerate token and send in cookies
    const authToken = signJwt({ userId: user.id });

    return res
      .status(200)
      .cookie("authToken", authToken, {
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS (in production)
      })
      .json({
        success: true,
        user: { ...userWithoutPendingReqs, pendingRequestsNumber },
      });
  },
);

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = signUpSchema.safeParse(req.body);
    if (!parsedData.success) {
      throw new AppError("Incorrect Details", 400);
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
      throw new AppError("Failed to save user", 400);
    }

    // user exists --> generate token and send in cookies
    const authToken = signJwt({ userId: user.id });

    return res
      .status(200)
      .cookie("authToken", authToken, {
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true, // Prevents XSS attacks
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS (in production)
      })
      .json({ success: true, user: { ...user, pendingRequestsNumber: 0 } });
  },
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId as string;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: { receivedFriendRequests: { where: { status: "PENDING" } } },
    });

    if (!user) {
      throw new AppError("No such user", 404);
    }

    const pendingRequestsNumber = user.receivedFriendRequests.length;
    const { receivedFriendRequests, ...userWithoutRecievedRequests } = user;

    return res.status(200).json({
      success: true,
      user: { ...userWithoutRecievedRequests, pendingRequestsNumber },
    });
  },
);

export const getFriends = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId as string;

    const friends = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        sentFriendRequests: {
          where: { status: "ACCEPTED" },
          include: {
            receiver: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        receivedFriendRequests: {
          where: { status: "ACCEPTED" },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!friends) {
      throw new AppError("No User with this Id", 404);
    }

    const friendsList = [
      ...friends.sentFriendRequests.map((req) => req.receiver),
      ...friends.receivedFriendRequests.map((req) => req.sender),
    ];

    return res.status(200).json({ success: true, friends: friendsList });
  },
);

export const getPendingRequests = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId as string;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        receivedFriendRequests: {
          where: { status: "PENDING" },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError("No such user", 404);
    }

    const pendingRequests = user.receivedFriendRequests.map((req) => ({
      ...req.sender,
    }));

    return res.status(200).json({ success: true, pendingRequests });
  },
);

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const param = req.query;
    const searchString = param.searchString as string;
    const userId = req.userId as string;

    // get all users from the db
    const allUsers: {
      id: string;
      username: string;
      email: string;
      relationshipStatus?: string;
    }[] = await prisma.user.findMany({
      select: {
        username: true,
        id: true,
        email: true,
      },
    });

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentFriendRequests: {
          select: {
            receiver: { select: { id: true } },
            sender: { select: { id: true } },
            status: true,
          },
        },
        receivedFriendRequests: {
          select: {
            sender: { select: { id: true } },
            receiver: { select: { id: true } },
            status: true,
          },
        },
      },
    });

    if (!currentUser) {
      throw new AppError("No such user", 404);
    }

    // Create a Set of friend IDs for efficient lookup
    const friendsIdSet = new Set([
      ...currentUser.sentFriendRequests.map((req) => {
        if (req.status === "ACCEPTED") return req.receiver.id;
      }),
      ...currentUser.receivedFriendRequests.map((req) => {
        if (req.status === "ACCEPTED") return req.sender.id;
      }),
    ]);

    // ids of users who sent req to current user and are pending
    const recievedReqIdSet = new Set([
      ...currentUser.receivedFriendRequests.map((req) => {
        if (req.status === "PENDING") return req.sender.id;
      }),
    ]);

    // ids of users to whom current user sent req and is pending
    const sentReqIdSet = new Set([
      ...currentUser.sentFriendRequests.map((req) => {
        if (req.status === "PENDING") return req.receiver.id;
      }),
    ]);

    // Add friendship status to each user
    const allUsersWithrelationshipStatus = allUsers.map((user) => {
      // self
      if (user.id === currentUser.id) {
        user.relationshipStatus = "self";
      }
      // friend
      else if (friendsIdSet.has(user.id)) {
        user.relationshipStatus = "friend";
      }
      // request_received
      else if (recievedReqIdSet.has(user.id)) {
        user.relationshipStatus = "request_received";
      }
      //request_sent
      else if (sentReqIdSet.has(user.id)) {
        user.relationshipStatus = "request_sent";
      }
      // not_friend
      else user.relationshipStatus = "not_friend";

      return user;
    });

    // Filter by search string if provided
    if (searchString) {
      const filteredUsers = allUsersWithrelationshipStatus.filter((user) =>
        user.username.toLowerCase().includes(searchString.toLowerCase()),
      );
      return res.status(200).json({ success: true, users: filteredUsers });
    }

    return res
      .status(200)
      .json({ success: true, users: allUsersWithrelationshipStatus });
  },
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res
      .clearCookie("authToken")
      .json({ success: true, message: "User Logged Out" });
  },
);
