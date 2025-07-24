import z from "zod";

export const getConversationSchema = z.object({
  type: z.enum(["DIRECT", "GROUP"]),
});

export const getMessagesSchema = z.object({
  conversationId: z.string(),
});
