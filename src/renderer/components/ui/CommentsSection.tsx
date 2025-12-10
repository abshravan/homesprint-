import { useState } from 'react';
import { useComments, useCreateComment } from '../../hooks/useComments';
import { Button } from '../ui/button';
import { Loader2, User } from 'lucide-react';

export const CommentsSection = ({ issueId }: { issueId: number }) => {
    const { data: comments, isLoading } = useComments(issueId);
    const createComment = useCreateComment();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setIsSubmitting(true);
        try {
            await createComment.mutateAsync({
                issue_id: issueId,
                author_id: 1, // Default user
                content,
                is_passive_aggressive: Math.random() > 0.5 // Randomly passive aggressive
            });
            setContent('');
        } catch (error) {
            // Error handling - could show toast notification
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                {comments?.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                            <User className="h-4 w-4 text-secondary-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">{comment.author_name || 'Unknown User'}</span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(comment.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="text-sm text-foreground bg-muted/30 p-3 rounded-md">
                                {comment.content}
                            </div>
                            {comment.is_passive_aggressive && (
                                <span className="text-[10px] text-orange-500 italic">
                                    * Detected passive-aggressive tone
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                {comments?.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No comments yet. Start an argument!</p>
                )}
            </div>

            <div className="flex space-x-4 pt-4 border-t">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                    ME
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
