import {
  acceptRequestSchema,
  sendRequestSchema,
} from "@chatify/zod/friendRequestSchema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { prisma } from "@chatify/db";
import { NextFunction, Request, Response } from "express";

export const sendRequest = asyncHandler(async (req : Request, res : Response, next : NextFunction) => {
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

export const acceptRequest = asyncHandler(async (req : Request, res : Response, next : NextFunction) => {
  // get the friend request id from the body
  const parsedData = acceptRequestSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new AppError("Incorrect Details", 400);
  }
  // get the userId from the req
  const currentUserId = req.userId as string;

  // check if the receiver Id of the request is same as that of the userId
  let friendRequest = await prisma.friendRequest.findFirst({
    where: {
      AND: {
        senderId: parsedData.data.senderId,
        receiverId: currentUserId,
      },
    },
  });

  if (friendRequest?.status !== "PENDING") {
    throw new AppError("Friend request already processed", 400);
  }
  if (!friendRequest || friendRequest.receiverId !== currentUserId) {
    throw new AppError("invalid friend Request", 404);
  }

  // Wrap all write operations in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update the friend request status
    const updatedFriendRequest = await tx.friendRequest.update({
      where: { id: friendRequest.id },
      data: { status: "ACCEPTED" },
    });

    // Create a Direct conversation between the senderId and userId
    const conversation = await tx.conversation.create({
      data: {
        type: "DIRECT",
        createdBy: parsedData.data.senderId,
        members: {
          create: [
            {
              userId: currentUserId,
            },
            {
              userId: parsedData.data.senderId,
            },
          ],
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
          where: {
            userId: parsedData.data.senderId,
          },
        },
      },
    });

    // Return the data we need from the transaction
    return {
      friendRequest: updatedFriendRequest,
      conversation: conversation,
    };
  });

  // Process the result outside the transaction
  const convotoSend = {
    id: result.conversation.id,
    friend: result.conversation.members[0]?.user,
  };

  if (!convotoSend || !convotoSend.id || !convotoSend.friend) {
    throw new AppError("Failed to create conversation", 500);
  }

  return res.status(200).json({ success: true, conversation: convotoSend });
});
