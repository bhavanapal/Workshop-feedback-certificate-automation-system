import {z} from 'zod'

export const workshopschema = z.object({
    collegeName : z.string().nonempty('College name is must required *'),
    workshopName : z.string().min(1, 'Workshop name is required'),
    date : z.string().min(1, 'Date are required'),
    time: z.string().min(1, 'Time are required'),
    instructions : z.string().min(1, "Instructions are required"),
    templateUrl : z.string().optional(),
    studentEmail : z.string().email('Invalid email address').min(1, 'Student email is required')
});

export type WorkshopSchema = z.infer<typeof workshopschema>;