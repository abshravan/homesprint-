export interface IssueHistory {
    id: number;
    issue_id: number;
    user_id: number;
    field_name: string;
    old_value?: string;
    new_value?: string;
    change_type: 'created' | 'updated' | 'deleted';
    created_at: string;
}

export interface CreateHistoryDto {
    issue_id: number;
    user_id: number;
    field_name: string;
    old_value?: string;
    new_value?: string;
    change_type: 'created' | 'updated' | 'deleted';
}

export interface IssueHistoryWithUser extends IssueHistory {
    user_display_name: string;
    user_avatar_url?: string;
}
