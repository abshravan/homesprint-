import { useState } from 'react';
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from '../../hooks/useComments';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Loader2, User, Edit3, Trash2, X, Check } from 'lucide-react';

export const CommentsSection = ({ issueId }: { issueId: number }) => {
    const { user } = useAuth();
    const { data: comments, isLoading } = useComments(issueId);
    const createComment = useCreateComment();
    const updateComment = useUpdateComment();
    const deleteComment = useDeleteComment();

    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await createComment.mutateAsync({
                issue_id: issueId,
                author_id: user?.id || 1,
                content,
                is_passive_aggressive: Math.random() > 0.5 // Randomly passive aggressive
            });
            setContent('');
        } catch (error) {
            console.error('Failed to create comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartEdit = (commentId: number, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditContent(currentContent);
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const handleSaveEdit = async (commentId: number) => {
        if (!editContent.trim()) return;

        try {
            await updateComment.mutateAsync({
                id: commentId,
                content: editContent,
                issueId,
            });
            setEditingCommentId(null);
            setEditContent('');
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };

    const handleDelete = async (commentId: number) => {
        try {
            await deleteComment.mutateAsync({
                id: commentId,
                issueId,
            });
            setDeletingCommentId(null);
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    if (isLoading) {
        return <div className="py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {comments?.map((comment) => (
                    <div key={comment.id} className="flex space-x-4 group">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-secondary-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">{comment.author_name || 'Unknown User'}</span>
                                    {comment.is_edited && (
                                        <span className="text-xs text-muted-foreground italic">(edited)</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </span>
                                    {user && user.id === comment.author_id && editingCommentId !== comment.id && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleStartEdit(comment.id, comment.content)}
                                                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                                                title="Edit comment"
                                            >
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setDeletingCommentId(comment.id)}
                                                className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                                                title="Delete comment"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {editingCommentId === comment.id ? (
                                <div className="space-y-2">
                                    <textarea
                                        className="w-full min-h-[60px] p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleCancelEdit}
                                        >
                                            <X className="h-3.5 w-3.5 mr-1" />
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="enterprise"
                                            onClick={() => handleSaveEdit(comment.id)}
                                            disabled={!editContent.trim()}
                                        >
                                            <Check className="h-3.5 w-3.5 mr-1" />
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="text-sm text-foreground bg-muted/30 p-3 rounded-md">
                                        {comment.content}
                                    </div>
                                    {comment.is_passive_aggressive && (
                                        <span className="text-[10px] text-orange-500 italic">
                                            * Detected passive-aggressive tone
                                        </span>
                                    )}
                                </>
                            )}

                            {deletingCommentId === comment.id && (
                                <div className="mt-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
                                    <p className="text-sm text-foreground mb-2">
                                        Are you sure you want to delete this comment?
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setDeletingCommentId(null)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(comment.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {comments?.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No comments yet. Start an argument!</p>
                )}
            </div>

            <div className="flex space-x-4 pt-4 border-t">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs flex-shrink-0">
                    {user?.display_name?.slice(0, 2).toUpperCase() || 'ME'}
                </div>
                <div className="flex-1 space-y-2">
                    <textarea
                        className="w-full min-h-[80px] p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        placeholder="Add a passive-aggressive comment..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button
                            size="sm"
                            variant="enterprise"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !content.trim()}
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
