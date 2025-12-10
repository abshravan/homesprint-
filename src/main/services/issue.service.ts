import { Database } from 'better-sqlite3';
import { getDatabase } from '../database/connection';
import { Issue, CreateIssueDto, IssueType } from '../../shared/types/issue.types';
import { CreateIssueDtoSchema, UpdateIssueStatusSchema } from '../../shared/validation/issue.validation';

export class IssueService {
    private db: Database;

    constructor() {
        this.db = getDatabase();
    }

    getAll(): Issue[] {
        return this.db.prepare('SELECT * FROM issues ORDER BY created_at DESC').all() as Issue[];
    }

    getById(id: number): Issue | undefined {
        return this.db.prepare('SELECT * FROM issues WHERE id = ?').get(id) as Issue | undefined;
    }

    create(issue: CreateIssueDto): Issue {
        // Validate input
        const validatedIssue = CreateIssueDtoSchema.parse(issue);

        // Generate Issue Key (e.g., PROJ-1)
        const projectKey = this.db.prepare('SELECT key FROM projects WHERE id = ?').get(validatedIssue.project_id) as { key: string } | undefined;
        if (!projectKey) {
            throw new Error(`Project with id ${validatedIssue.project_id} not found`);
        }

        const count = this.db.prepare('SELECT COUNT(*) as count FROM issues WHERE project_id = ?').get(validatedIssue.project_id) as { count: number };
        const issueKey = `${projectKey.key}-${count.count + 1}`;

        const stmt = this.db.prepare(`
      INSERT INTO issues (
        issue_key, project_id, issue_type_id, summary, description,
        priority, assignee_id, reporter_id, due_date, story_points,
        procrastination_level, spouse_approval_required
      )
      VALUES (
        @issue_key, @project_id, @issue_type_id, @summary, @description,
        @priority, @assignee_id, @reporter_id, @due_date, @story_points,
        @procrastination_level, @spouse_approval_required
      )
    `);

        const info = stmt.run({
            ...validatedIssue,
            issue_key: issueKey,
            description: validatedIssue.description || null,
            priority: validatedIssue.priority || 'medium',
            assignee_id: validatedIssue.assignee_id || null,
            due_date: validatedIssue.due_date || null,
            story_points: validatedIssue.story_points || null,
            procrastination_level: validatedIssue.procrastination_level || 'low',
            spouse_approval_required: validatedIssue.spouse_approval_required ? 1 : 0
        });

        const createdIssue = this.getById(info.lastInsertRowid as number);
        if (!createdIssue) {
            throw new Error('Failed to create issue: Could not retrieve created issue');
        }

        return createdIssue;
    }

    updateStatus(id: number, status: string): Issue {
        // Validate input
        const validated = UpdateIssueStatusSchema.parse({ id, status });

        const result = this.db.prepare('UPDATE issues SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(validated.status, validated.id);

        if (result.changes === 0) {
            throw new Error(`Issue with id ${id} not found`);
        }

        const updatedIssue = this.getById(id);
        if (!updatedIssue) {
            throw new Error(`Failed to update issue: Could not retrieve issue with id ${id}`);
        }

        return updatedIssue;
    }

    getIssueTypes(): IssueType[] {
        return this.db.prepare('SELECT * FROM issue_types').all() as IssueType[];
    }

    getDashboardStats() {
        const totalIssues = this.db.prepare('SELECT COUNT(*) as count FROM issues').get() as { count: number };
        const overdueIssues = this.db.prepare(`
            SELECT COUNT(*) as count FROM issues
            WHERE due_date < date('now') AND status != 'done'
        `).get() as { count: number };
        const completedIssues = this.db.prepare(`
            SELECT COUNT(*) as count FROM issues
            WHERE status = 'done'
        `).get() as { count: number };
        const inProgressIssues = this.db.prepare(`
            SELECT COUNT(*) as count FROM issues
            WHERE status = 'in_progress'
        `).get() as { count: number };

        return {
            totalIssues: totalIssues.count,
            overdueIssues: overdueIssues.count,
            completedIssues: completedIssues.count,
            inProgressIssues: inProgressIssues.count
        };
    }
}
