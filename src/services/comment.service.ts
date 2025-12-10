import { getDatabase } from '../lib/database';
import { Comment, CreateCommentDto } from '../shared/types/comment.types';
import { CreateCommentDtoSchema } from '../shared/validation/comment.validation';

export class CommentService {
    private db = getDatabase();

    async getByIssueId(issueId: number): Promise<Comment[]> {
        const comments = await this.db.getAllByIndex('comments', 'issue_id', issueId);

        // Enrich comments with author information
        const enrichedComments = await Promise.all(
            comments.map(async (comment) => {
                const author = await this.db.getById('users', comment.author_id);
                return {
                    ...comment,
                    author_name: author?.display_name,
                    author_avatar: author?.avatar_url,
                };
            })
        );

        return enrichedComments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    async create(comment: CreateCommentDto): Promise<Comment> {
        // Validate input
        const validatedComment = CreateCommentDtoSchema.parse(comment);

        const now = new Date().toISOString();
        const commentData = {
            ...validatedComment,
            created_at: now,
            updated_at: now,
            is_edited: false,
            is_passive_aggressive: validatedComment.is_passive_aggressive || false,
        };

        const id = await this.db.add('comments', commentData);
        const createdComment = await this.db.getById('comments', id);

        if (!createdComment) {
            throw new Error('Failed to create comment: Could not retrieve created comment');
        }

        return createdComment;
    }
}

// Singleton instance
let commentServiceInstance: CommentService | null = null;

export function getCommentService(): CommentService {
    if (!commentServiceInstance) {
        commentServiceInstance = new CommentService();
    }
    return commentServiceInstance;
}
