import z from "zod";


export const  createGroupSchema = z.object({
    name : z.string().min(3).max(20),
    description : z.string().min(5).max(100).optional(),
    createdBy : z.string()
})

export const inviteToGroupSchema = z.object({
    senderId : z.string(),
    conversationId : z.string(),
    receiverIds : z.array(z.string()).min(1),
})


export const acceptInviteSchema = z.object({
    inviteId : z.string(),
    currentUserId : z.string(),
    conversationId : z.string(),
})