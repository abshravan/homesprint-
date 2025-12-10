import { z } from 'zod';

const VALID_PRIORITIES = ['blocker', 'critical', 'major', 'medium', 'minor', 'trivial'] as const;
const VALID_PROCRASTINATION_LEVELS = ['low', 'medium', 'high', 'extreme'] as const;

export const CreateIssueDtoSchema = z.object({
    project_id: z.number().int().positive('Project ID must be a positive integer'),
    issue_type_id: z.number().int().positive('Issue type ID must be a positive integer'),
    summary: z.string().min(1, 'Summary is required').max(500, 'Summary must be less than 500 characters'),
    description: z.string().max(10000, 'Description must be less than 10000 characters').optional(),
    priority: z.enum(VALID_PRIORITIES).optional(),
    assignee_id: z.number().int().positive('Assignee ID must be a positive integer').optional(),
    reporter_id: z.number().int().positive('Reporter ID must be a positive integer'),
    due_date: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
    story_points: z.number().int().min(0).max(100, 'Story points must be between 0 and 100').optional(),
    procrastination_level: z.enum(VALID_PROCRASTINATION_LEVELS).optional(),
    spouse_approval_required: z.boolean().optional(),
});

export const UpdateIssueStatusSchema = z.object({
    id: z.number().int().positive('Issue ID must be a positive integer'),
    status: z.string().min(1, 'Status is required').max(50, 'Status must be less than 50 characters'),
});

export type CreateIssueDtoInput = z.infer<typeof CreateIssueDtoSchema>;
export type UpdateIssueStatusInput = z.infer<typeof UpdateIssueStatusSchema>;
