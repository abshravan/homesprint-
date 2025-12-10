import { z } from 'zod';

export const CreateProjectDtoSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(200, 'Project name must be less than 200 characters'),
    key: z.string()
        .min(2, 'Project key must be at least 2 characters')
        .max(10, 'Project key must be less than 10 characters')
        .regex(/^[A-Z][A-Z0-9]*$/, 'Project key must start with a letter and contain only uppercase letters and numbers'),
    description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
    created_by: z.number().int().positive('Created by must be a positive integer'),
});

export type CreateProjectDtoInput = z.infer<typeof CreateProjectDtoSchema>;
