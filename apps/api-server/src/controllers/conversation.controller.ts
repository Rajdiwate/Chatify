import { getConversationSchema } from "@chatify/zod/conversationSchema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { prisma } from "@chatify/db";
import { NextFunction, Request, Response } from "express";

export const getAllConversation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = getConversationSchema.safeParse(req.body);
    const userId = req.userId as string;

    if (!parsedData.success) {
      throw new AppError("Incorrect Details", 400);
    }

    // Conversations where the current user is a member
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
      const directConvos = convos.filter(
        (convo: (typeof convos)[number]) => convo.type === "DIRECT",
      );

      const convoToSend = directConvos.map((convo: (typeof convos)[number]) => {
        const friend = convo.members.filter(
          (member: (typeof convo.members)[number]) => member.user.id !== userId,
        )[0]?.user;

        return {
          id: convo.id,
          friend,
        };
      });

      return res.status(200).json({
        success: true,
        conversations: convoToSend,
      });
    } else {
      const groupConvos = convos.filter(
        (convo: (typeof convos)[number]) => convo.members.length > 2,
      );

      const convoToSend = groupConvos.map((convo: (typeof convos)[number]) => {
        const members = convo.members.filter(
          (member: (typeof convo.members)[number]) => member.user.id !== userId,
        );

        return {
          id: convo.id,
          groupName: convo.name,
          members,
        };
      });

      return res.status(200).json({
        success: true,
        conversations: convoToSend,
      });
    }
  },
);
