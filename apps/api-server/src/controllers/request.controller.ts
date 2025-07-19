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

  //chek if the reciever Id of the request is same as that of the userId
  let friendRequest = await prisma.friendRequest.findUnique({
    where: { id: parsedData.data.id },
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
  return res.status(200).json({ success: true, friendRequest });

  // dont create a conversation for the user.
  // conversation can be created during send-message api
});
