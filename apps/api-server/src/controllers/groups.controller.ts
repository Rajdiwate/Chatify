import {
  acceptInviteSchema,
  createGroupSchema,
  inviteToGroupSchema,
} from "@chatify/zod/groupsSchema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { prisma } from "@chatify/db";

export const createGroup = asyncHandler(async (req, res, next) => {
  const parsedData = createGroupSchema.safeParse({
    ...req.body,
    createdBy: req.userId,
  });

  if (!parsedData.success) {
    throw new AppError("Incorrect Details", 400);
  }

  const dataToSave: {
    type: "GROUP";
    name: string;
    createdBy: string;
    description?: string;
  } = {
    type: "GROUP",
    name: parsedData.data.name,
    createdBy: parsedData.data.createdBy,
  };

  if (parsedData.data.description) {
    dataToSave["description"] = parsedData.data.description;
  }

  const data = await prisma.$transaction(async (tx) => {
    const group = await tx.conversation.create({ data: dataToSave });

    const member = await tx.chatMember.create({
      data: {
        conversationId: group.id,
        userId: parsedData.data.createdBy,
        role: "OWNER",
      },
    });

    return { group, member };
  });

  const { group, member } = data;

  if (!group || !member) {
    throw new AppError("Failed to create group", 500);
  }

  return res.status(200).json({ success: true, group });
});

export const invitToGroup = asyncHandler(async (req, res, next) => {
  //do we need to check if the user is a member of the group or if there is already an invite pending

  const parsedData = inviteToGroupSchema.safeParse({
    ...req.body,
    senderId: req.userId,
  });

  if (!parsedData.success) {
    throw new AppError("Incorrect Details", 400);
  }

  const invite = await prisma.groupInvite.create({
    data: {
      conversationId: parsedData.data.conversationId,
      receiverId: parsedData.data.receiverId,
      senderId: parsedData.data.senderId,
    },
  });

  if (!invite) {
    throw new AppError("Failed to invite user", 500);
  }

  return res.status(200).json({ success: true });
});

export const acceptInvite = asyncHandler(async (req, res, next) => {
  // will have to change the status of the invite to ACCEPTED
  // add the to chat member table

  const parsedData = acceptInviteSchema.safeParse({
    ...req.body,
    currentUserId: req.userId,
  });

  if (!parsedData.success) {
    throw new AppError("Incorrect Details", 400);
  }

  const { member, invite } = await prisma.$transaction(async (tx) => {
    const invite = await prisma.groupInvite.update({
      where: {
        id: parsedData.data.inviteId,
      },
      data: {
        status: "ACCEPTED",
      },
    });
    const member = await prisma.chatMember.create({
      data: {
        conversationId: parsedData.data.conversationId,
        userId: parsedData.data.currentUserId,
      },
    });
    return { invite, member };
  });

  if (!invite || !member) {
    throw new AppError("Failed to accept invite", 500);
  }

  return res.status(201).json({ succes: true, member });
});

export const getPendingGroupInvites = asyncHandler(async (req, res, next) => {
  const userId = req.userId as string;

  const invites = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      receivedInvites: {
        where: { status: "PENDING" },
        select: {
          id: true,
          conversation: {
            select: {
              id: true,
              name: true,
            },
          }
        },
      },
    },
  });
  
  if (!invites) {
    throw new AppError("No such user", 404);
  }
  return res
    .status(200)
    .json({
      success: true,
      invites: invites.receivedInvites.map((invite) => ({
        id: invite.id,
        conversation: invite.conversation,
      })),
    });
});
