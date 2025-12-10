import { useIssues } from '../hooks/useIssues';
import { Button } from '../components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export const MyOpenIssuesPage = () => {
    const { data: allIssues, isLoading } = useIssues();
    const navigate = useNavigate();

    // Filter for open issues (not done)
    const issues = allIssues?.filter(issue => issue.status !== 'done');

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading your open tasks...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Open Issues</h1>
                    <p className="text-muted-foreground">All the things you're still avoiding.</p>
                </div>
                <Button onClick={() => navigate('/issues/create')} variant="enterprise">Create Issue</Button>
            </div>

            <div className="rounded-md border bg-card">
                <MockTable>
                    <MockTableHeader>
                        <MockTableRow>
                            <MockTableHead>Key</MockTableHead>
                            <MockTableHead>Summary</MockTableHead>
                            <MockTableHead>Status</MockTableHead>
                            <MockTableHead>Priority</MockTableHead>
                            <MockTableHead>Procrastination Level</MockTableHead>
                            <MockTableHead>Created</MockTableHead>
                        </MockTableRow>
                    </MockTableHeader>
                    <MockTableBody>
                        {issues?.length === 0 ? (
                            <MockTableRow>
                                <MockTableCell>
                                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground col-span-6">
                                        <CheckCircle2 className="h-8 w-8 mb-2" />
                                        <p>No open issues! You're either done or in denial.</p>
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
                                        <StatusBadge status={issue.status} />
                                    </MockTableCell>
                                    <MockTableCell>{issue.priority}</MockTableCell>
                                    <MockTableCell>{issue.procrastination_level}</MockTableCell>
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
