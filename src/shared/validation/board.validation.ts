import { z } from 'zod';

const VALID_BOARD_TYPES = ['kanban', 'scrum'] as const;

export const CreateBoardDtoSchema = z.object({
    project_id: z.number().int().positive('Project ID must be a positive integer'),
    name: z.string().min(1, 'Board name is required').max(200, 'Board name must be less than 200 characters'),
    type: z.enum(VALID_BOARD_TYPES, { errorMap: () => ({ message: 'Board type must be either kanban or scrum' }) }),
    columns: z.string().optional(), // JSON string
    filter_query: z.string().max(1000, 'Filter query must be less than 1000 characters').optional(),
});

export type CreateBoardDtoInput = z.infer<typeof CreateBoardDtoSchema>;
