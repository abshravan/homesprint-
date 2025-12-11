import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssues, useUpdateIssueStatus, useUpdateIssue, useDeleteIssue } from '../hooks/useIssues';
import { useUsers } from '../hooks/useUsers';
import { useIssueHistory } from '../hooks/useHistory';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { TransitionDialog } from '../components/ui/TransitionDialog';
import { CommentsSection } from '../components/ui/CommentsSection';
import { ExcuseGenerator } from '../components/ui/ExcuseGenerator';
import { SpouseApprovalModal } from '../components/ui/SpouseApprovalModal';
import { IssueHistoryTimeline } from '../components/IssueHistoryTimeline';
import {
    Loader2,
    ArrowLeft,
    Share2,
    MoreHorizontal,
    AlertTriangle,
    Calendar,
    Edit,
    Trash2,
    Save,
    X,
} from 'lucide-react';

export const IssueDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: issues, isLoading } = useIssues();
    const { data: users } = useUsers();
    const updateStatus = useUpdateIssueStatus();
    const updateIssue = useUpdateIssue();
    const deleteIssue = useDeleteIssue();

    const [isTransitionOpen, setIsTransitionOpen] = useState(false);
    const [isSpouseApprovalOpen, setIsSpouseApprovalOpen] = useState(false);
    const [targetStatus, setTargetStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState<'comments' | 'history' | 'worklog'>('comments');

    const { data: history, isLoading: isLoadingHistory } = useIssueHistory(id ? Number(id) : undefined);

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

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    // Edit form state
    const [editFormData, setEditFormData] = useState({
        summary: issue?.summary || '',
        description: issue?.description || '',
        priority: issue?.priority || 'medium',
        assignee_id: issue?.assignee_id,
        due_date: issue?.due_date || '',
        procrastination_level: issue?.procrastination_level || 'low',
        spouse_approval_required: issue?.spouse_approval_required || false,
        story_points: issue?.story_points || 1,
    });

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

    const handleEditClick = () => {
        if (issue) {
            setEditFormData({
                summary: issue.summary,
                description: issue.description || '',
                priority: issue.priority,
                assignee_id: issue.assignee_id,
                due_date: issue.due_date || '',
                procrastination_level: issue.procrastination_level || 'low',
                spouse_approval_required: issue.spouse_approval_required || false,
                story_points: issue.story_points || 1,
            });
            setIsEditing(true);
        }
    };

    const handleSaveEdit = async () => {
        if (issue) {
            try {
                await updateIssue.mutateAsync({
                    id: issue.id,
                    updates: {
                        ...editFormData,
                        due_date: editFormData.due_date || undefined,
                    },
                });
                setIsEditing(false);
            } catch (error) {
                console.error('Failed to update issue:', error);
            }
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (issue) {
            setIsDeleting(true);
            try {
                await deleteIssue.mutateAsync(issue.id);
                navigate('/issues');
            } catch (error) {
                console.error('Failed to delete issue:', error);
                setIsDeleting(false);
                setShowDeleteConfirm(false);
            }
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
                    {isAdmin && !isEditing && (
                        <>
                            <Button variant="outline" size="sm" onClick={handleEditClick}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </>
                    )}
                    {isEditing && (
                        <>
                            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button variant="enterprise" size="sm" onClick={handleSaveEdit}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </>
                    )}
                    <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card p-6 rounded-lg border shadow-lg max-w-md">
                        <h2 className="text-xl font-bold mb-4 flex items-center text-destructive">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Delete Issue?
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Are you sure you want to delete <strong>{issue.issue_key}</strong>? This action cannot be undone.
                            All comments and history will be permanently lost.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Permanently
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="col-span-2 space-y-6">
                    <div>
                        {isEditing ? (
                            <div className="space-y-4 p-6 bg-accent/30 rounded-lg border-2 border-primary/20">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Summary</label>
                                    <input
                                        type="text"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editFormData.summary}
                                        onChange={e => setEditFormData({ ...editFormData, summary: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={editFormData.description}
                                        onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}

                        <div className="space-y-4 pt-6">
                            <h3 className="text-sm font-semibold text-muted-foreground">Activity</h3>
                            <div className="flex items-center space-x-4 border-b pb-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={activeTab === 'comments' ? "font-bold border-b-2 border-primary rounded-none" : ""}
                                    onClick={() => setActiveTab('comments')}
                                >
                                    Comments
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={activeTab === 'history' ? "font-bold border-b-2 border-primary rounded-none" : ""}
                                    onClick={() => setActiveTab('history')}
                                >
                                    History
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={activeTab === 'worklog' ? "font-bold border-b-2 border-primary rounded-none" : ""}
                                    onClick={() => setActiveTab('worklog')}
                                >
                                    Work Log
                                </Button>
                            </div>

                            {activeTab === 'comments' && <CommentsSection issueId={issue.id} />}
                            {activeTab === 'history' && (
                                <div className="py-4">
                                    {isLoadingHistory ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : (
                                        <IssueHistoryTimeline history={history || []} />
                                    )}
                                </div>
                            )}
                            {activeTab === 'worklog' && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p className="text-sm">Work log feature coming soon...</p>
                                </div>
                            )}
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

                    <div className={`p-4 border rounded-lg bg-card shadow-sm space-y-4 ${isEditing ? 'border-primary/50' : ''}`}>
                        <h3 className="font-semibold">Details {isEditing && <span className="text-xs text-primary">(Editing)</span>}</h3>
                        <div className="space-y-1">
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <div className="text-muted-foreground">Assignee</div>
                                {isEditing ? (
                                    <select
                                        className="text-sm rounded border border-input bg-background px-2 py-1"
                                        value={editFormData.assignee_id || ''}
                                        onChange={e => setEditFormData({ ...editFormData, assignee_id: e.target.value ? Number(e.target.value) : undefined })}
                                    >
                                        <option value="">Unassigned</option>
                                        {users?.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.display_name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <div className={`h-5 w-5 rounded-full ${assignee ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                        <span>{assignee?.display_name || 'Unassigned'}</span>
                                    </div>
                                )}

                                <div className="text-muted-foreground">Reporter</div>
                                <div className="flex items-center space-x-2">
                                    <div className="h-5 w-5 rounded-full bg-green-500"></div>
                                    <span>{reporter?.display_name || 'Unknown'}</span>
                                </div>

                                <div className="text-muted-foreground">Priority</div>
                                {isEditing ? (
                                    <select
                                        className="text-sm rounded border border-input bg-background px-2 py-1 capitalize"
                                        value={editFormData.priority}
                                        onChange={e => setEditFormData({ ...editFormData, priority: e.target.value })}
                                    >
                                        <option value="trivial">Trivial</option>
                                        <option value="minor">Minor</option>
                                        <option value="medium">Medium</option>
                                        <option value="major">Major</option>
                                        <option value="critical">Critical</option>
                                        <option value="blocker">Blocker</option>
                                    </select>
                                ) : (
                                    <div className="capitalize">{issue.priority}</div>
                                )}

                                <div className="text-muted-foreground">Story Points</div>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        className="text-sm rounded border border-input bg-background px-2 py-1 w-20"
                                        value={editFormData.story_points}
                                        onChange={e => setEditFormData({ ...editFormData, story_points: Number(e.target.value) })}
                                    />
                                ) : (
                                    <div>{issue.story_points || '-'}</div>
                                )}

                                <div className="text-muted-foreground">Due Date</div>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        className="text-sm rounded border border-input bg-background px-2 py-1"
                                        value={editFormData.due_date}
                                        onChange={e => setEditFormData({ ...editFormData, due_date: e.target.value })}
                                    />
                                ) : (
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
                                )}
                            </div>
                        </div>

                        <div className="space-y-1 pt-4 border-t">
                            <span className="text-xs font-semibold text-muted-foreground uppercase">Parody Metrics</span>
                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                <div className="text-muted-foreground">Procrastination</div>
                                {isEditing ? (
                                    <select
                                        className="text-sm rounded border border-input bg-background px-2 py-1 capitalize"
                                        value={editFormData.procrastination_level}
                                        onChange={e => setEditFormData({ ...editFormData, procrastination_level: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="extreme">Extreme</option>
                                    </select>
                                ) : (
                                    <div className="font-bold text-purple-600 capitalize">{issue.procrastination_level}</div>
                                )}

                                <div className="text-muted-foreground">Spouse Approval</div>
                                {isEditing ? (
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300"
                                        checked={editFormData.spouse_approval_required}
                                        onChange={e => setEditFormData({ ...editFormData, spouse_approval_required: e.target.checked })}
                                    />
                                ) : (
                                    <div>
                                        {issue.spouse_approval_required ? (
                                            <span className="text-red-500 flex items-center"><AlertTriangle className="h-3 w-3 mr-1" /> Required</span>
                                        ) : (
                                            <span className="text-green-500">Not Needed</span>
                                        )}
                                    </div>
                                )}

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
