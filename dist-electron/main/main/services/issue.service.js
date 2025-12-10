"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueService = void 0;
const connection_1 = require("../database/connection");
class IssueService {
    constructor() {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.db = (0, connection_1.getDatabase)();
    }
    getAll() {
        return this.db.prepare('SELECT * FROM issues ORDER BY created_at DESC').all();
    }
    getById(id) {
        return this.db.prepare('SELECT * FROM issues WHERE id = ?').get(id);
    }
    create(issue) {
        // Generate Issue Key (e.g., PROJ-1)
        const projectKey = this.db.prepare('SELECT key FROM projects WHERE id = ?').get(issue.project_id);
        const count = this.db.prepare('SELECT COUNT(*) as count FROM issues WHERE project_id = ?').get(issue.project_id);
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
        return this.getById(info.lastInsertRowid);
    }
    updateStatus(id, status) {
        this.db.prepare('UPDATE issues SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
        return this.getById(id);
    }
    getIssueTypes() {
        return this.db.prepare('SELECT * FROM issue_types').all();
    }
    getDashboardStats() {
        const totalIssues = this.db.prepare('SELECT COUNT(*) as count FROM issues').get();
        const overdueIssues = this.db.prepare(`
            SELECT COUNT(*) as count FROM issues
            WHERE due_date < date('now') AND status != 'done'
        `).get();
        const completedIssues = this.db.prepare(`
            SELECT COUNT(*) as count FROM issues
            WHERE status = 'done'
        `).get();
        const inProgressIssues = this.db.prepare(`
            SELECT COUNT(*) as count FROM issues
            WHERE status = 'in_progress'
        `).get();
        return {
            totalIssues: totalIssues.count,
            overdueIssues: overdueIssues.count,
            completedIssues: completedIssues.count,
            inProgressIssues: inProgressIssues.count
        };
    }
}
exports.IssueService = IssueService;
