export interface Sprint {
    id: number;
    board_id: number;
    name: string;
    start_date?: string;
    end_date?: string;
    goal?: string;
    status: 'active' | 'future' | 'closed';
    created_at: string;
}

export interface CreateSprintDto {
    board_id: number;
    name: string;
    start_date?: string;
    end_date?: string;
    goal?: string;
}
