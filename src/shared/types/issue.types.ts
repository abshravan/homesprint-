export interface Issue {
    id: number;
    issue_key: string;
    project_id: number;
    issue_type_id: number;
    summary: string;
    description?: string;
    status: string;
    priority: string;
    assignee_id?: number;
    reporter_id: number;
    created_at: string;
    updated_at: string;
    due_date?: string;
    resolved_at?: string;
    story_points?: number;
    epic_link?: number;
    sprint_id?: number;
    original_estimate?: number;
    remaining_estimate?: number;
    time_spent?: number;

    // Parody fields
    procrastination_level?: string;
    excuse_category?: string;
    netflix_episodes?: number;
    likelihood_completion?: number;
    spouse_approval_required?: boolean;
    energy_level_required?: string;
    budget_impact?: string;
}

export interface CreateIssueDto {
    project_id: number;
    issue_type_id: number;
    summary: string;
    description?: string;
    status?: string;
    priority?: string;
    assignee_id?: number;
    reporter_id: number;
    due_date?: string;
    story_points?: number;

    // Parody fields
    procrastination_level?: string;
    spouse_approval_required?: boolean;
}

export interface IssueType {
    id: number;
    name: string;
    icon?: string;
    color?: string;
    description?: string;
}
