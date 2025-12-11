import { getDatabase } from '../lib/database';
import { Issue, CreateIssueDto, IssueType } from '../shared/types/issue.types';
import { CreateIssueDtoSchema, UpdateIssueStatusSchema } from '../shared/validation/issue.validation';

export class IssueService {
    private db = getDatabase();

    async getAll(): Promise<Issue[]> {
        const issues = await this.db.getAll('issues');
        return issues.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    async getById(id: number): Promise<Issue | undefined> {
        return await this.db.getById('issues', id);
    }

    async create(issue: CreateIssueDto): Promise<Issue> {
        // Validate input
        const validatedIssue = CreateIssueDtoSchema.parse(issue);

        // Generate Issue Key (e.g., PROJ-1)
        const project = await this.db.getById('projects', validatedIssue.project_id);
        if (!project) {
            throw new Error(`Project with id ${validatedIssue.project_id} not found`);
        }

        const count = await this.db.count('issues', 'project_id', validatedIssue.project_id);
        const issueKey = `${project.key}-${count + 1}`;

        const now = new Date().toISOString();
        const issueData = {
            ...validatedIssue,
            issue_key: issueKey,
            status: validatedIssue.status || 'todo',
            priority: validatedIssue.priority || 'medium',
            procrastination_level: validatedIssue.procrastination_level || 'low',
            spouse_approval_required: validatedIssue.spouse_approval_required || false,
            netflix_episodes: 0,
            created_at: now,
            updated_at: now,
        };

        const id = await this.db.add('issues', issueData);
        const createdIssue = await this.getById(id);

        if (!createdIssue) {
            throw new Error('Failed to create issue: Could not retrieve created issue');
        }

        return createdIssue;
    }

    async updateStatus(id: number, status: string): Promise<Issue> {
        // Validate input
        const validated = UpdateIssueStatusSchema.parse({ id, status });

        const issue = await this.getById(validated.id);
        if (!issue) {
            throw new Error(`Issue with id ${validated.id} not found`);
        }

        const updatedIssue = {
            ...issue,
            status: validated.status,
            updated_at: new Date().toISOString(),
            resolved_at: validated.status === 'done' ? new Date().toISOString() : issue.resolved_at,
        };

        await this.db.update('issues', updatedIssue);
        return updatedIssue;
    }

    async update(id: number, updates: Partial<Issue>): Promise<Issue> {
        const issue = await this.getById(id);
        if (!issue) {
            throw new Error(`Issue with id ${id} not found`);
        }

        const updatedIssue = {
            ...issue,
            ...updates,
            id: issue.id, // Ensure ID doesn't change
            issue_key: issue.issue_key, // Ensure issue key doesn't change
            created_at: issue.created_at, // Preserve creation date
            updated_at: new Date().toISOString(),
        };

        await this.db.update('issues', updatedIssue);
        const result = await this.getById(id);

        if (!result) {
            throw new Error('Failed to update issue: Could not retrieve updated issue');
        }

        return result;
    }

    async delete(id: number): Promise<void> {
        const issue = await this.getById(id);
        if (!issue) {
            throw new Error(`Issue with id ${id} not found`);
        }

        await this.db.delete('issues', id);
    }

    async getIssueTypes(): Promise<IssueType[]> {
        return await this.db.getAll('issue_types');
    }

    async getDashboardStats() {
        const allIssues = await this.getAll();
        const now = new Date();

        const totalIssues = allIssues.length;
        const overdueIssues = allIssues.filter(
            issue => issue.due_date && new Date(issue.due_date) < now && issue.status !== 'done'
        ).length;
        const completedIssues = allIssues.filter(issue => issue.status === 'done').length;
        const inProgressIssues = allIssues.filter(issue => issue.status === 'in_progress').length;

        return {
            totalIssues,
            overdueIssues,
            completedIssues,
            inProgressIssues,
        };
    }
}

// Singleton instance
let issueServiceInstance: IssueService | null = null;

export function getIssueService(): IssueService {
    if (!issueServiceInstance) {
        issueServiceInstance = new IssueService();
    }
    return issueServiceInstance;
}
