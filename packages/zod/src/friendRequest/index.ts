import z from "zod";

// only need receiverId. Sender Id will be of the authenticated User
export const sendRequestSchema = z.object({
  receiverId: z.string(),
});

export const acceptRequestSchema = z.object({
  senderId: z.string(),
});
