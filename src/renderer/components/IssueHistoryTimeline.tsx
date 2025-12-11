import { IssueHistoryWithUser } from '../../shared/types/history.types';
import { Clock, Plus, Edit3, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IssueHistoryTimelineProps {
    history: IssueHistoryWithUser[];
}

const getChangeIcon = (changeType: string) => {
    switch (changeType) {
        case 'created':
            return <Plus className="h-3.5 w-3.5 text-green-600" />;
        case 'updated':
            return <Edit3 className="h-3.5 w-3.5 text-blue-600" />;
        case 'deleted':
            return <Trash2 className="h-3.5 w-3.5 text-red-600" />;
        default:
            return <Clock className="h-3.5 w-3.5 text-gray-600" />;
    }
};

const formatFieldName = (field: string): string => {
    const fieldMap: Record<string, string> = {
        'summary': 'Summary',
        'description': 'Description',
        'status': 'Status',
        'priority': 'Priority',
        'assignee_id': 'Assignee',
        'due_date': 'Due Date',
        'story_points': 'Story Points',
        'procrastination_level': 'Procrastination Level',
        'spouse_approval_required': 'Spouse Approval',
        'issue': 'Issue',
    };
    return fieldMap[field] || field;
};

const getChangeDescription = (entry: IssueHistoryWithUser): string => {
    const field = formatFieldName(entry.field_name);

    switch (entry.change_type) {
        case 'created':
            return `created this issue ${entry.new_value}`;
        case 'deleted':
            return `deleted this issue`;
        case 'updated':
            if (entry.field_name === 'assignee_id') {
                return `changed ${field}`;
            }
            if (entry.old_value && entry.new_value) {
                return `changed ${field} from "${entry.old_value}" to "${entry.new_value}"`;
            } else if (entry.new_value) {
                return `set ${field} to "${entry.new_value}"`;
            } else if (entry.old_value) {
                return `removed ${field} (was "${entry.old_value}")`;
            }
            return `updated ${field}`;
        default:
            return `made a change`;
    }
};

const getUserInitials = (name: string): string => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const IssueHistoryTimeline = ({ history }: IssueHistoryTimelineProps) => {
    if (!history || history.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No history available</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((entry, index) => (
                <div key={entry.id} className="flex gap-3 group">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                        {/* Avatar */}
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-xs font-semibold text-primary border border-primary/30">
                            {entry.user_avatar_url ? (
                                <img
                                    src={entry.user_avatar_url}
                                    alt={entry.user_display_name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : (
                                getUserInitials(entry.user_display_name)
                            )}
                        </div>

                        {/* Vertical line */}
                        {index < history.length - 1 && (
                            <div className="w-0.5 h-full min-h-[24px] bg-border mt-2" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">
                                        {entry.user_display_name}
                                    </span>
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-muted/50 text-xs text-muted-foreground">
                                        {getChangeIcon(entry.change_type)}
                                        <span className="capitalize">{entry.change_type}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-foreground/80">
                                    {getChangeDescription(entry)}
                                </p>
                            </div>
                            <time className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                            </time>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
