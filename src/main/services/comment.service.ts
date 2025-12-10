import { Database } from 'better-sqlite3';
import { getDatabase } from '../database/connection';
import { Comment, CreateCommentDto } from '../../shared/types/comment.types';

export class CommentService {
    private db: Database;

    constructor() {
        this.db = getDatabase();
    }

    getByIssueId(issueId: number): Comment[] {
        return this.db.prepare(`
      SELECT c.*, u.display_name as author_name, u.avatar_url as author_avatar
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.issue_id = ?
      ORDER BY c.created_at ASC
    `).all(issueId) as Comment[];
    }

    create(comment: CreateCommentDto): Comment {
        const stmt = this.db.prepare(`
      INSERT INTO comments (issue_id, author_id, content, is_passive_aggressive)
      VALUES (@issue_id, @author_id, @content, @is_passive_aggressive)
    `);

        const info = stmt.run({
            ...comment,
            is_passive_aggressive: comment.is_passive_aggressive ? 1 : 0
        });

        return this.db.prepare('SELECT * FROM comments WHERE id = ?').get(info.lastInsertRowid) as Comment;
    }
}
