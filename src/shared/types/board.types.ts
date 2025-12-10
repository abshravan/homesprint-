export interface Board {
    id: number;
    project_id: number;
    name: string;
    type: 'scrum' | 'kanban';
    created_at: string;
}

export interface CreateBoardDto {
    project_id: number;
    name: string;
    type: 'scrum' | 'kanban';
}
