export interface Project {
    id: number;
    name: string;
    key: string;
    description?: string;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export interface CreateProjectDto {
    name: string;
    key: string;
    description?: string;
    created_by: number;
}
