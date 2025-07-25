import { getMessagesSchema } from "@chatify/zod/conversationSchema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { prisma } from "@chatify/db";
import { client } from "../index";

export const getMessages = asyncHandler(async (req, res, next) => {
  const parsedData = getMessagesSchema.safeParse(req.body);
  if (!parsedData.success) {
    throw new AppError("Incorrect Details", 400);
  }
  console.log("convoID", parsedData.data.conversationId);
  const convo = await prisma.conversation.findUnique({
    where: { id: parsedData.data.conversationId },
    include: {
      messages: {
        include: { sender: { select: { id: true, username: true } } },
      },
      members: true,
    },
  });

  const messagesToSend: TRecentMessage[] | undefined = convo?.messages.map(
    ({ sender, ...rest }) => {
      return {
        content: rest.content,
        createdAt: rest.createdAt,
        senderId: sender.id,
        senderName: sender.username,
        conversationId: rest.conversationId,
      };
    },
  );

  console.log("dbMessages", messagesToSend);

  type TRecentMessage = {
    senderId: string;
    content: string;
    createdAt: Date;
    senderName: string;
    conversationId: string;
  };

  const messagesRaw = await client.lRange(
    `conversation:${parsedData.data.conversationId}`,
    0,
    49,
  ); // 50 most recent (from index 0 to 9)

  console.log("messagesRaw", messagesRaw);

  const recentMessages: TRecentMessage[] = messagesRaw.map((raw) => {
    const obj = JSON.parse(raw);
    return {
      ...obj,
    };
  });
  console.log("recent messages", recentMessages);
  const mergedMessages = [...(messagesToSend ?? []), ...recentMessages];
  console.log("merged messages", mergedMessages);
  const uniqueMessages = Array.from(
    new Map(mergedMessages.map((msg) => [msg.createdAt, msg])).values(),
  ).sort((a, b) => {
    return a.createdAt > b.createdAt ? -1 : 1;
  });

  if (!convo) {
    throw new AppError("No such conversation", 404);
  }
  console.log("members", convo.members);
  console.log("messages", uniqueMessages);

  // get messages from redis and merge them with convo.messages
  return res.status(200).json({
    success: true,
    messages: uniqueMessages || [],
    members: convo?.members || [],
  });
});
