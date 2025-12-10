import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Issue } from '../../../shared/types/issue.types';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface IssueCardProps {
    issue: Issue;
}

export const IssueCard = ({ issue }: IssueCardProps) => {
    const navigate = useNavigate();
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: issue.id.toString(),
        data: { issue },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'low': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
            default: return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "bg-card p-3 rounded-md border shadow-sm cursor-grab hover:shadow-md transition-all space-y-2",
                isDragging && "opacity-50 ring-2 ring-primary rotate-2 z-50"
            )}
            onClick={() => navigate(`/issues/${issue.id}`)}
        >
            <div className="flex items-start justify-between">
                <span className="text-sm font-medium line-clamp-2">{issue.summary}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                    {getPriorityIcon(issue.priority)}
                    <span className="font-mono">{issue.issue_key}</span>
                </div>

                {issue.spouse_approval_required && (
                    <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded">
                        APPROVAL NEEDED
                    </span>
                )}
            </div>
        </div>
    );
};
