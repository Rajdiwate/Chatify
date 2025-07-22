import z from "zod";

export const getConversationSchema = z.object({
  type: z.enum(["DIRECT", "GROUP"]),
});
