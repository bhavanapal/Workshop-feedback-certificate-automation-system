import {z} from 'zod'

export const loginschema = z.object({
    email : z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters log'),
});
export type LoginSchema = z.infer<typeof loginschema>
