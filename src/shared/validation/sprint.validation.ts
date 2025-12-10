import { z } from 'zod';

export const CreateSprintDtoSchema = z.object({
    board_id: z.number().int().positive('Board ID must be a positive integer'),
    name: z.string().min(1, 'Sprint name is required').max(200, 'Sprint name must be less than 200 characters'),
    goal: z.string().max(1000, 'Sprint goal must be less than 1000 characters').optional(),
    start_date: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
    end_date: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
}).refine(
    (data) => {
        if (data.start_date && data.end_date) {
            return new Date(data.start_date) < new Date(data.end_date);
        }
        return true;
    },
    {
        message: 'End date must be after start date',
        path: ['end_date'],
    }
);

export type CreateSprintDtoInput = z.infer<typeof CreateSprintDtoSchema>;
