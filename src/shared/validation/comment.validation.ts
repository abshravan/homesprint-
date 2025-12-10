import { z } from 'zod';

export const CreateCommentDtoSchema = z.object({
    issue_id: z.number().int().positive('Issue ID must be a positive integer'),
    author_id: z.number().int().positive('Author ID must be a positive integer'),
    content: z.string().min(1, 'Comment content is required').max(5000, 'Comment must be less than 5000 characters'),
    parent_comment_id: z.number().int().positive('Parent comment ID must be a positive integer').optional(),
    is_passive_aggressive: z.boolean().optional(),
});

export type CreateCommentDtoInput = z.infer<typeof CreateCommentDtoSchema>;
