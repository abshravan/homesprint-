"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const connection_1 = require("../database/connection");
class CommentService {
    constructor() {
        Object.defineProperty(this, "db", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.db = (0, connection_1.getDatabase)();
    }
    getByIssueId(issueId) {
        return this.db.prepare(`
      SELECT c.*, u.display_name as author_name, u.avatar_url as author_avatar
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.issue_id = ?
      ORDER BY c.created_at ASC
    `).all(issueId);
    }
    create(comment) {
        const stmt = this.db.prepare(`
      INSERT INTO comments (issue_id, author_id, content, is_passive_aggressive)
      VALUES (@issue_id, @author_id, @content, @is_passive_aggressive)
    `);
        const info = stmt.run({
            ...comment,
            is_passive_aggressive: comment.is_passive_aggressive ? 1 : 0
        });
        return this.db.prepare('SELECT * FROM comments WHERE id = ?').get(info.lastInsertRowid);
    }
}
exports.CommentService = CommentService;
