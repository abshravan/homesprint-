import { useIssues } from '../hooks/useIssues';
import { useUsers } from '../hooks/useUsers';
import { Button } from '../components/ui/button';
import { Loader2, CheckCircle2, Calendar, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock components for now since we haven't created them yet
const MockTable = ({ children }: { children: React.ReactNode }) => <div className="w-full overflow-auto"><table className="w-full caption-bottom text-sm">{children}</table></div>;
const MockTableHeader = ({ children }: { children: React.ReactNode }) => <thead className="[&_tr]:border-b">{children}</thead>;
const MockTableBody = ({ children }: { children: React.ReactNode }) => <tbody className="[&_tr:last-child]:border-0">{children}</tbody>;
const MockTableRow = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`} onClick={onClick}>{children}</tr>;
const MockTableHead = ({ children }: { children: React.ReactNode }) => <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">{children}</th>;
const MockTableCell = ({ children }: { children: React.ReactNode }) => <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{children}</td>;

const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
        'todo': 'bg-slate-500',
        'in_progress': 'bg-blue-500',
        'done': 'bg-green-500',
        'blocked': 'bg-red-500',
        'procrastinating': 'bg-purple-500',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${colors[status] || 'bg-gray-500'}`}>
            {status.replace('_', ' ').toUpperCase()}
        </span>
    );
};



export const IssueListPage = () => {
    const { data: issues, isLoading } = useIssues();
    const { data: users } = useUsers();
    const navigate = useNavigate();

    const getUserName = (userId?: number) => {
        if (!userId) return 'Unassigned';
        const user = users?.find(u => u.id === userId);
        return user?.display_name || 'Unknown User';
    };

    const isOverdue = (dueDate?: string) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    };

    const formatDueDate = (dueDate?: string) => {
        if (!dueDate) return '-';
        const date = new Date(dueDate);
        const today = new Date();
        const diffTime = date.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return `${Math.abs(diffDays)} days overdue`;
        } else if (diffDays === 0) {
            return 'Due today';
        } else if (diffDays === 1) {
            return 'Due tomorrow';
        } else if (diffDays <= 7) {
            return `Due in ${diffDays} days`;
        }
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading your pile of shame...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">All Issues</h1>
                    <p className="text-muted-foreground">Everything you promised to do but haven't.</p>
                </div>
                <Button onClick={() => navigate('/issues/create')} variant="enterprise">Create Issue</Button>
            </div>

            <div className="rounded-md border bg-card">
                <MockTable>
                    <MockTableHeader>
                        <MockTableRow>
                            <MockTableHead>Key</MockTableHead>
                            <MockTableHead>Summary</MockTableHead>
                            <MockTableHead>Assignee</MockTableHead>
                            <MockTableHead>Status</MockTableHead>
                            <MockTableHead>Priority</MockTableHead>
                            <MockTableHead>Due Date</MockTableHead>
                            <MockTableHead>Created</MockTableHead>
                        </MockTableRow>
                    </MockTableHeader>
                    <MockTableBody>
                        {issues?.length === 0 ? (
                            <MockTableRow>
                                <MockTableCell>
                                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground col-span-6">
                                        <CheckCircle2 className="h-8 w-8 mb-2" />
                                        <p>No issues found. Are you actually productive?</p>
                                    </div>
                                </MockTableCell>
                            </MockTableRow>
                        ) : (
                            issues?.map((issue) => (
                                <MockTableRow
                                    key={issue.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/issues/${issue.id}`)}
                                >
                                    <MockTableCell>
                                        <span className="font-mono text-xs text-muted-foreground">{issue.issue_key}</span>
                                    </MockTableCell>
                                    <MockTableCell>
                                        <span className="font-medium">{issue.summary}</span>
                                    </MockTableCell>
                                    <MockTableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-sm">{getUserName(issue.assignee_id)}</span>
                                        </div>
                                    </MockTableCell>
                                    <MockTableCell>
                                        <StatusBadge status={issue.status} />
                                    </MockTableCell>
                                    <MockTableCell>
                                        <span className="capitalize">{issue.priority}</span>
                                    </MockTableCell>
                                    <MockTableCell>
                                        {issue.due_date ? (
                                            <div className={`flex items-center gap-1 ${isOverdue(issue.due_date) ? 'text-destructive font-medium' : ''}`}>
                                                {isOverdue(issue.due_date) && <AlertCircle className="h-3 w-3" />}
                                                <Calendar className="h-3 w-3" />
                                                <span className="text-xs">{formatDueDate(issue.due_date)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                    </MockTableCell>
                                    <MockTableCell>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(issue.created_at).toLocaleDateString()}
                                        </span>
                                    </MockTableCell>
                                </MockTableRow>
                            ))
                        )}
                    </MockTableBody>
                </MockTable>
            </div>
        </div>
    );
};
