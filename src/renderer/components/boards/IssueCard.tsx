import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Issue } from '../../../shared/types/issue.types';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle,
    Clock,
    HelpCircle,
    Calendar,
    User,
    MessageSquare,
    Flag
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUsers } from '../../hooks/useUsers';
import { useComments } from '../../hooks/useComments';

interface IssueCardProps {
    issue: Issue;
}

export const IssueCard = ({ issue }: IssueCardProps) => {
    const navigate = useNavigate();
    const { data: users } = useUsers();
    const { data: comments } = useComments(issue.id);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: issue.id!.toString(),
        data: { issue },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const assignee = issue.assignee_id ? users?.find(u => u.id === issue.assignee_id) : null;
    const isOverdue = issue.due_date && issue.status !== 'done' && new Date(issue.due_date) < new Date();
    const commentCount = comments?.length || 0;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'blocker': return 'text-red-700 bg-red-100 dark:bg-red-900/30';
            case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
            case 'major': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
            case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
            case 'minor': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
            case 'trivial': return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'blocker':
            case 'critical':
                return <AlertTriangle className="h-3 w-3" />;
            case 'major':
            case 'medium':
                return <Flag className="h-3 w-3" />;
            case 'minor':
                return <Clock className="h-3 w-3" />;
            case 'trivial':
                return <HelpCircle className="h-3 w-3" />;
            default:
                return <HelpCircle className="h-3 w-3" />;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "bg-card p-3 rounded-md border shadow-sm cursor-grab hover:shadow-md hover:border-primary/50 transition-all space-y-2.5 group",
                isDragging && "opacity-50 ring-2 ring-primary rotate-2 z-50 cursor-grabbing"
            )}
            onClick={() => {
                // Only navigate if not dragging
                if (!isDragging) {
                    navigate(`/issues/${issue.id}`);
                }
            }}
        >
            {/* Issue Key and Priority */}
            <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground font-semibold">
                    {issue.issue_key}
                </span>
                <div className={cn(
                    "flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase",
                    getPriorityColor(issue.priority)
                )}>
                    {getPriorityIcon(issue.priority)}
                    <span className="hidden group-hover:inline">{issue.priority}</span>
                </div>
            </div>

            {/* Summary */}
            <h4 className="text-sm font-medium line-clamp-2 leading-tight">
                {issue.summary}
            </h4>

            {/* Labels/Tags */}
            <div className="flex flex-wrap gap-1">
                {issue.spouse_approval_required && (
                    <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-medium">
                        APPROVAL
                    </span>
                )}
                {issue.procrastination_level === 'extreme' && (
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded font-medium">
                        EXTREME
                    </span>
                )}
                {isOverdue && (
                    <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-medium flex items-center space-x-0.5">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        <span>OVERDUE</span>
                    </span>
                )}
            </div>

            {/* Footer - Metadata */}
            <div className="flex items-center justify-between pt-1 border-t">
                {/* Left side - Due date & Story points */}
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    {issue.due_date && (
                        <div className={cn(
                            "flex items-center space-x-1",
                            isOverdue && "text-red-500 font-semibold"
                        )}>
                            <Calendar className="h-3 w-3" />
                            <span className="text-[10px]">
                                {new Date(issue.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    )}
                    {issue.story_points && (
                        <div className="flex items-center">
                            <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">
                                {issue.story_points} pts
                            </span>
                        </div>
                    )}
                </div>

                {/* Right side - Assignee & Comments */}
                <div className="flex items-center space-x-2">
                    {commentCount > 0 && (
                        <div className="flex items-center space-x-1 text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-[10px] font-medium">{commentCount}</span>
                        </div>
                    )}
                    {assignee && (
                        <div
                            className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-semibold ring-2 ring-background"
                            title={assignee.display_name}
                        >
                            {assignee.display_name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    {!assignee && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
