export interface Comment {
    id: number;
    issue_id: number;
    author_id: number;
    content: string;
    created_at: string;
    updated_at: string;

    // Parody fields
    is_passive_aggressive?: boolean;
    sarcasm_level?: string;

    // Joined fields
    author_name?: string;
    author_avatar?: string;
}

export interface CreateCommentDto {
    issue_id: number;
    author_id: number;
    content: string;
    is_passive_aggressive?: boolean;
}
