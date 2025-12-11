import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssues, useUpdateIssueStatus } from '../hooks/useIssues';
import { useUsers } from '../hooks/useUsers';
import { Button } from '../components/ui/button';
import { TransitionDialog } from '../components/ui/TransitionDialog';
import { CommentsSection } from '../components/ui/CommentsSection';
import { ExcuseGenerator } from '../components/ui/ExcuseGenerator';
import { SpouseApprovalModal } from '../components/ui/SpouseApprovalModal';
import {
    Loader2,
    ArrowLeft,
    Share2,
    MoreHorizontal,
    AlertTriangle,
    Calendar,
} from 'lucide-react';

export const IssueDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: issues, isLoading } = useIssues();
    const { data: users } = useUsers();
    const updateStatus = useUpdateIssueStatus();

    const [isTransitionOpen, setIsTransitionOpen] = useState(false);
    const [isSpouseApprovalOpen, setIsSpouseApprovalOpen] = useState(false);
    const [targetStatus, setTargetStatus] = useState('');

    const handleTransition = (status: string) => {
        if (status === 'done' && issue?.spouse_approval_required) {
            setTargetStatus(status);
            setIsSpouseApprovalOpen(true);
        } else {
            setTargetStatus(status);
            setIsTransitionOpen(true);
        }
    };

    const handleSpouseApproved = () => {
        setIsTransitionOpen(true);
    };

    // In a real app we'd fetch by ID, but for now we filter the list
    const issue = issues?.find(i => i.id === Number(id));

    // Get assignee and reporter user info
    const assignee = issue?.assignee_id ? users?.find(u => u.id === issue.assignee_id) : null;
    const reporter = issue?.reporter_id ? users?.find(u => u.id === issue.reporter_id) : null;

    // Check if issue is overdue
    const isOverdue = issue?.due_date && issue.status !== 'done' && new Date(issue.due_date) < new Date();

    const handleStatusClick = (status: string) => {
        if (status === issue?.status) return;
        setTargetStatus(status);
        setIsTransitionOpen(true);
    };

    const handleTransitionConfirm = async () => {
        if (issue && targetStatus) {
            await updateStatus.mutateAsync({ id: issue.id, status: targetStatus });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <h2 className="text-2xl font-bold">Issue Not Found</h2>
                <p className="text-muted-foreground">It probably got lost in the laundry.</p>
                <Button onClick={() => navigate('/issues')}>Back to List</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <TransitionDialog
                isOpen={isTransitionOpen}
                onClose={() => setIsTransitionOpen(false)}
                onConfirm={handleTransitionConfirm}
                toStatus={targetStatus}
            />

            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/issues')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>HOME / {issue.issue_key}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-4">{issue.summary}</h1>
                        <div className="flex items-center space-x-4 mb-6">
                            <Button variant="enterprise" size="sm">Attach</Button>
                            <div className="flex space-x-1">
                                {['todo', 'in_progress', 'done'].map((s) => (
                                    <Button
                                        key={s}
                                        variant={issue.status === s ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleStatusClick(s)}
                                        className="capitalize"
                                    >
                                        {s.replace('_', ' ')}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-muted-foreground">Description</h3>
                            <div className="p-4 bg-card border rounded-md min-h-[100px]">
                                {issue.description || <span className="text-muted-foreground italic">No description provided (typical).</span>}
                            </div>
                        </div>

                        <div className="space-y-4 pt-6">
                            <h3 className="text-sm font-semibold text-muted-foreground">Activity</h3>
                            <div className="flex items-center space-x-4 border-b pb-2">
                                <Button variant="ghost" size="sm" className="font-bold border-b-2 border-primary rounded-none">Comments</Button>
                                <Button variant="ghost" size="sm">History</Button>
                                <Button variant="ghost" size="sm">Work Log</Button>
                            </div>

                            <CommentsSection issueId={issue.id} />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-card shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Status</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${issue.status === 'done' ? 'bg-green-100 text-green-800' :
                                issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {issue.status.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="flex flex-col space-y-2">
                            {/* Transition Buttons */}
                            {issue.status === 'todo' && (
                                <Button size="sm" onClick={() => handleTransition('in_progress')} variant="outline">Start Progress</Button>
                            )}
                            {issue.status === 'in_progress' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Button size="sm" onClick={() => handleTransition('done')} variant="default">Done</Button>
                                    <Button size="sm" onClick={() => handleTransition('blocked')} variant="destructive">Block</Button>
                                </div>
                            )}
                            {issue.status === 'blocked' && (
                                <Button size="sm" onClick={() => handleTransition('in_progress')} variant="outline">Unblock</Button>
                            )}
                            {issue.status === 'done' && (
                                <Button size="sm" onClick={() => handleTransition('in_progress')} variant="ghost">Reopen</Button>
                            )}
                        </div>
                    </div>

                    <ExcuseGenerator issueId={issue.id} />

                    <SpouseApprovalModal
                        isOpen={isSpouseApprovalOpen}
                        onClose={() => setIsSpouseApprovalOpen(false)}
                        onApprove={handleSpouseApproved}
                    />

                    <div className="p-4 border rounded-lg bg-card shadow-sm space-y-4">
                        <h3 className="font-semibold">Details</h3>
                        <div className="space-y-1">
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <div className="text-muted-foreground">Assignee</div>
                                <div className="flex items-center space-x-2">
                                    <div className={`h-5 w-5 rounded-full ${assignee ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                    <span>{assignee?.display_name || 'Unassigned'}</span>
                                </div>

                                <div className="text-muted-foreground">Reporter</div>
                                <div className="flex items-center space-x-2">
                                    <div className="h-5 w-5 rounded-full bg-green-500"></div>
                                    <span>{reporter?.display_name || 'Unknown'}</span>
                                </div>

                                <div className="text-muted-foreground">Priority</div>
                                <div className="capitalize">{issue.priority}</div>

                                <div className="text-muted-foreground">Story Points</div>
                                <div>{issue.story_points || '-'}</div>

                                <div className="text-muted-foreground">Due Date</div>
                                <div className="flex items-center space-x-1">
                                    {issue.due_date ? (
                                        <>
                                            <Calendar className="h-3 w-3" />
                                            <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
                                                {new Date(issue.due_date).toLocaleDateString()}
                                            </span>
                                            {isOverdue && (
                                                <AlertTriangle className="h-3 w-3 text-red-500 ml-1" />
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground">No deadline (lucky you)</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 pt-4 border-t">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Parody Metrics</span>
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <div className="text-muted-foreground">Procrastination</div>
                                <div className="font-bold text-purple-600 capitalize">{issue.procrastination_level}</div>

                                <div className="text-muted-foreground">Spouse Approval</div>
                                <div>
                                    {issue.spouse_approval_required ? (
                                        <span className="text-red-500 flex items-center"><AlertTriangle className="h-3 w-3 mr-1" /> Required</span>
                                    ) : (
                                        <span className="text-green-500">Not Needed</span>
                                    )}
                                </div>

                                <div className="text-muted-foreground">Netflix Episodes</div>
                                <div>{issue.netflix_episodes || 0}</div>

                                <div className="text-muted-foreground">Likelihood</div>
                                <div>{issue.likelihood_completion || 0}%</div>
                            </div>
                        </div>

                        <div className="space-y-1 pt-4 border-t">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Dates</span>
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <div className="text-muted-foreground">Created</div>
                                <div>{new Date(issue.created_at).toLocaleDateString()}</div>

                                <div className="text-muted-foreground">Updated</div>
                                <div>{new Date(issue.updated_at).toLocaleDateString()}</div>

                                {issue.resolved_at && (
                                    <>
                                        <div className="text-muted-foreground">Resolved</div>
                                        <div className="text-green-600">{new Date(issue.resolved_at).toLocaleDateString()}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-md p-4 bg-card">
                        <h4 className="text-sm font-semibold mb-2">People</h4>
                        <p className="text-xs text-muted-foreground">
                            No one is watching this issue. You are safe to ignore it.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
