import { prisma } from "@chatify/db";
import { IMessage, MessageStore } from "../MessageStore";
import { retry } from "./insertUtil";

export const batchInsert = async (messages: IMessage[]) => {
  const data = await prisma.$transaction(async (tx) => {
    // Create an array of create promises
    const createPromises = messages.map((msg: IMessage) =>
      tx.message.create({
        data: {
          content: msg.content,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          createdAt: msg.createdAt,
        },
      }),
    );
    // Wait for all promises to resolve before the transaction finishes
    return Promise.all(createPromises);
  });
  return data;
};

export const insertAndRetry = async (messages: IMessage[]) => {
  //insert in db
  if (messages && messages.length) {
    try {
      await batchInsert(messages);
    } catch (error) {
      console.log("insert failed. pushing to retry queue", error);
      retry(messages);
    } finally {
      MessageStore.getInstance().clearStore();
    }
  }
};
