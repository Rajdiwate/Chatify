import { getMessagesSchema } from "@chatify/zod/conversationSchema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { prisma } from "@chatify/db";

export const getMessages = asyncHandler(async (req, res, next) => {
  const parsedData = getMessagesSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new AppError("Incorrect Details", 400);
  }
  console.log("convoID" , parsedData.data.conversationId)
  const convo = await prisma.conversation.findUnique({
    where: { id: parsedData.data.conversationId },
    include: {
      messages: {
        include: { sender: { select: { id: true, username: true } } },
      },
      members: true,
    },
  });

const messagesToSend = convo?.messages.map(({ sender, ...rest }) => {
  return {
    ...rest,
    senderId: sender.id,
    senderName: sender.username,
  };
});

  if (!convo) {
    throw new AppError("No such conversation", 404);
  }
  console.log("members", convo.members);
  console.log("messages", convo.messages);

  // get messages from redis and merge them with convo.messages
  return res.status(200).json({
    success: true,
    messages: messagesToSend || [],
    members: convo?.members || [],
  });
});
