import z from "zod";

// only need recieverId. Sender Id will be of the authenticated User
export const sendRequestSchema = z.object({
    receiverId : z.string(),
})

export const acceptRequestSchema =z.object({
    id : z.string()
})
