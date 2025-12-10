import { z } from 'zod';

const VALID_ROLES = ['admin', 'member', 'guest'] as const;

export const CreateUserDtoSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be less than 50 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    display_name: z.string().min(1, 'Display name is required').max(100, 'Display name must be less than 100 characters'),
    email: z.string().email('Invalid email address').optional(),
    avatar_url: z.string().url('Invalid avatar URL').optional(),
    role: z.enum(VALID_ROLES).optional(),
});

export type CreateUserDtoInput = z.infer<typeof CreateUserDtoSchema>;
