import { getConversationSchema } from "@chatify/zod/conversationSchema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { prisma } from "@chatify/db";
import { NextFunction, Request, Response } from "express";

export const getAllConversation = asyncHandler(async (req : Request, res : Response, next : NextFunction) => {
  const parsedData = getConversationSchema.safeParse(req.body);
  const userId = req.userId as string;
  if (!parsedData.success) {
    throw new AppError("Incorrect Details", 400);
  }

  //convos containing current user as a member
  const convos = await prisma.conversation.findMany({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      type: true,
      members: {
        select: {
          user: {
            select: {
              username: true,
              id: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (parsedData.data.type === "DIRECT") {
    const directConvos = convos.filter((convo) => {
      return convo.type === "DIRECT";
    });
    const convoToSend = directConvos.map((convo) => {
      return {
        id: convo.id,
        friend: convo.members.filter((member) => member.user.id !== userId)[0]
          ?.user,
      };
    });
    return res.status(200).json({
      success: true,
      conversations: convoToSend,
    });
  } else {
    const groupConvos = convos.filter((convo) => {
      return convo.members.length > 2;
    });
    const convoToSend = groupConvos.map((convo) => {
      return {
        id: convo.id,
        groupName: convo.name,
        members: convo.members.filter((member) => member.user.id !== userId),
      };
    });
    return res.status(200).json({
      success: true,
      conversations: convoToSend,
    });
  }
});
