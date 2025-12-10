export interface User {
    id: number;
    username: string;
    display_name: string;
    email?: string;
    avatar_url?: string;
    role: 'admin' | 'member' | 'guest';
    created_at: string;
    updated_at: string;
}

export interface CreateUserDto {
    username: string;
    display_name: string;
    email?: string;
    avatar_url?: string;
    role?: 'admin' | 'member' | 'guest';
}
