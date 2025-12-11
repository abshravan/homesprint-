import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Issue } from '../../../shared/types/issue.types';
import { IssueCard } from './IssueCard';
import { Button } from '../ui/button';
import { useCreateIssue } from '../../hooks/useIssues';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { Plus, Loader2, X } from 'lucide-react';

interface BoardColumnProps {
    id: string;
    title: string;
    issues: Issue[];
}

export const BoardColumn = ({ id, title, issues }: BoardColumnProps) => {
    const { user } = useAuth();
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    const [isCreating, setIsCreating] = useState(false);
    const [newIssueSummary, setNewIssueSummary] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const createIssue = useCreateIssue();

    const handleQuickCreate = async () => {
        if (!newIssueSummary.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await createIssue.mutateAsync({
                summary: newIssueSummary,
                project_id: 1, // Default project
                issue_type_id: 3, // Task
                reporter_id: user?.id || 1,
                status: id,
                priority: 'medium',
                procrastination_level: 'low',
            });
            setNewIssueSummary('');
            setIsCreating(false);
        } catch (error) {
            console.error('Failed to create issue:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getColumnColor = (columnId: string) => {
        switch (columnId) {
            case 'todo': return 'bg-slate-500/10 border-slate-500/20';
            case 'in_progress': return 'bg-blue-500/10 border-blue-500/20';
            case 'done': return 'bg-green-500/10 border-green-500/20';
            default: return 'bg-muted/30';
        }
    };

    const getHeaderColor = (columnId: string) => {
        switch (columnId) {
            case 'todo': return 'bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800';
            case 'in_progress': return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
            case 'done': return 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
            default: return 'bg-muted/50';
        }
    };

    return (
        <div className={cn(
            "flex flex-col h-full min-w-[300px] w-[300px] rounded-lg border-2 transition-colors",
            getColumnColor(id)
        )}>
            {/* Column Header */}
            <div className={cn(
                "p-3 border-b-2 rounded-t-lg flex items-center justify-between",
                getHeaderColor(id)
            )}>
                <h3 className="font-semibold text-sm uppercase tracking-wider">{title}</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono bg-background px-2 py-0.5 rounded-full border font-semibold">
                        {issues.length}
                    </span>
                    {!isCreating && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setIsCreating(true)}
                            title="Create issue"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Quick Create Form */}
            {isCreating && (
                <div className="p-2 border-b bg-background/50">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            value={newIssueSummary}
                            onChange={(e) => setNewIssueSummary(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleQuickCreate();
                                if (e.key === 'Escape') {
                                    setIsCreating(false);
                                    setNewIssueSummary('');
                                }
                            }}
                            autoFocus
                            disabled={isSubmitting}
                        />
                        <div className="flex items-center space-x-2">
                            <Button
                                size="sm"
                                variant="enterprise"
                                onClick={handleQuickCreate}
                                disabled={!newIssueSummary.trim() || isSubmitting}
                                className="h-7 text-xs"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Add'
                                )}
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewIssueSummary('');
                                }}
                                disabled={isSubmitting}
                                className="h-7 text-xs"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Issue List */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 p-2 space-y-2 overflow-y-auto min-h-[150px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
                    isOver && "bg-primary/10 ring-2 ring-primary ring-inset"
                )}
            >
                {issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                ))}

                {issues.length === 0 && !isCreating && (
                    <div className="h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-xs text-muted-foreground space-y-2">
                        <p>No issues yet</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setIsCreating(true)}
                        >
                            <Plus className="h-3 w-3 mr-1" />
                            Create issue
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
