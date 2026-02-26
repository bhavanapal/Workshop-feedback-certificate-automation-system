import {z} from 'zod'

export const studentschema = z.object({
    studentName : z.string().nonempty('Name is required *'),
    course : z.string().nonempty('Course is required'),
    email : z.string().email('Invalid email format'),
    feedback : z.string().min(1, 'Feedback is required'),
});

export type StudentSchema  = z.infer<typeof studentschema>
