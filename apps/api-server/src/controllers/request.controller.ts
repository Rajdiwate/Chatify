import {
  acceptRequestSchema,
  sendRequestSchema,
} from "@chatify/zod/friendRequestSchema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { prisma } from "@chatify/db";

export const sendRequest = asyncHandler(async (req, res, next) => {
  const parsedData = sendRequestSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new AppError("Incorrect Details", 400);
  }

  const senderId = req.userId as string;

  const friendRequest = await prisma.friendRequest.create({
    data: {
      senderId,
      receiverId: parsedData.data.receiverId,
    },
  });

  if (!friendRequest) {
    throw new AppError("Failed to send request", 500);
  }

  return res.status(201).json({ success: true, friendRequest });
});

export const acceptRequest = asyncHandler(async (req, res, next) => {
  // get the friend request id from the body
  const parsedData = acceptRequestSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new AppError("Incorrect Details", 400);
  }
  // get the userId from the req
  const currentUserId = req.userId as string;

  //chek if the receiver Id of the request is same as that of the userId
  let friendRequest = await prisma.friendRequest.findFirst({
    where: { AND : {
      senderId : parsedData.data.senderId,
      receiverId : currentUserId,
    } },
  });
  if (friendRequest?.status !== "PENDING") {
    throw new AppError("Friend request already processed", 400);
  }
  if (!friendRequest || friendRequest.receiverId !== currentUserId) {
    throw new AppError("invalid friend Request", 404);
  }
  // change the status of friendRequest
  friendRequest = await prisma.friendRequest.update({
    where: { id: friendRequest.id },
    data: { status: "ACCEPTED" },
  });

  const friends = await prisma.user.findUnique({
    where: {
      id: currentUserId,
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

  return res.status(200).json({ success: true, friendsList });

  // dont create a conversation for the user.
  // conversation can be created during send-message api
});
