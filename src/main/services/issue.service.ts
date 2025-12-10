import { Database } from 'better-sqlite3';
import { getDatabase } from '../database/connection';
import { Issue, CreateIssueDto, IssueType } from '../../shared/types/issue.types';

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
        // Generate Issue Key (e.g., PROJ-1)
        const projectKey = this.db.prepare('SELECT key FROM projects WHERE id = ?').get(issue.project_id) as { key: string };
        const count = this.db.prepare('SELECT COUNT(*) as count FROM issues WHERE project_id = ?').get(issue.project_id) as { count: number };
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
            ...issue,
            issue_key: issueKey,
            description: issue.description || null,
            priority: issue.priority || 'medium',
            assignee_id: issue.assignee_id || null,
            due_date: issue.due_date || null,
            story_points: issue.story_points || null,
            procrastination_level: issue.procrastination_level || 'low',
            spouse_approval_required: issue.spouse_approval_required ? 1 : 0
        });

        return this.getById(info.lastInsertRowid as number)!;
    }

    updateStatus(id: number, status: string): Issue {
        this.db.prepare('UPDATE issues SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
        return this.getById(id)!;
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
