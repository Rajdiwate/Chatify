import {z} from 'zod'

export const signInSchema = z.object({
    email : z.email(),
    password  : z.string().min(3).max(8)
})

export const signUpSchema = z.object({
    username : z.string(),
    email : z.email(),
    password : z.string().min(3).max(8),
    displayname : z.string().optional(),
    phoneNumber : z.string().optional(),
})