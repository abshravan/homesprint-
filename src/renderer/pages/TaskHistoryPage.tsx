import { useState, useMemo } from 'react';
import { useIssues } from '../hooks/useIssues';
import { useNavigate } from 'react-router-dom';
import {
    History,
    Clock,
    CheckCircle,
    Calendar,
    Search,
    TrendingUp,
    Award,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export const TaskHistoryPage = () => {
    const { data: issues, isLoading } = useIssues();
    const navigate = useNavigate();

    const [filterStatus, setFilterStatus] = useState<'all' | 'done' | 'archived'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'priority'>('recent');

    // Filter completed and old issues
    const historicalIssues = useMemo(() => {
        if (!issues) return [];

        let filtered = issues.filter(issue => {
            // Show done issues and older issues
            const isDone = issue.status === 'done';
            const isOld = new Date(issue.created_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days old

            if (filterStatus === 'done') return isDone;
            if (filterStatus === 'archived') return isOld;
            return isDone || isOld;
        });

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(issue =>
                issue.summary.toLowerCase().includes(query) ||
                issue.issue_key.toLowerCase().includes(query)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
            } else if (sortBy === 'oldest') {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            } else {
                const priorityOrder = { blocker: 0, critical: 1, major: 2, medium: 3, minor: 4, trivial: 5 };
                return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) -
                       (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
            }
        });

        return filtered;
    }, [issues, filterStatus, searchQuery, sortBy]);

    // Stats
    const stats = useMemo(() => {
        if (!issues) return { total: 0, completed: 0, archived: 0, avgCompletion: 0 };

        const completed = issues.filter(i => i.status === 'done').length;
        const archived = issues.filter(i => new Date(i.created_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

        const completedIssues = issues.filter(i => i.status === 'done' && i.created_at && i.resolved_at);
        const avgTime = completedIssues.length > 0
            ? completedIssues.reduce((sum, issue) => {
                const created = new Date(issue.created_at).getTime();
                const resolved = new Date(issue.resolved_at!).getTime();
                return sum + (resolved - created);
            }, 0) / completedIssues.length
            : 0;

        return {
            total: historicalIssues.length,
            completed,
            archived,
            avgCompletion: Math.round(avgTime / (1000 * 60 * 60 * 24)) // Convert to days
        };
    }, [issues, historicalIssues]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <History className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading task history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="bg-gradient-teal-dark p-6 border-b border-primary/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <History className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Task History</h1>
                            <p className="text-teal-100 text-sm">Review completed and archived tasks</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Historical</p>
                                    <p className="text-2xl font-bold text-primary mt-1">{stats.total}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-primary/50" />
                            </div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 border border-green-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Completed</p>
                                    <p className="text-2xl font-bold text-green-500 mt-1">{stats.completed}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-500/50" />
                            </div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Archived</p>
                                    <p className="text-2xl font-bold text-blue-500 mt-1">{stats.archived}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-blue-500/50" />
                            </div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 border border-amber-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Completion</p>
                                    <p className="text-2xl font-bold text-amber-500 mt-1">{stats.avgCompletion}d</p>
                                </div>
                                <Award className="h-8 w-8 text-amber-500/50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant={filterStatus === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('all')}
                            >
                                All
                            </Button>
                            <Button
                                variant={filterStatus === 'done' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('done')}
                            >
                                Completed
                            </Button>
                            <Button
                                variant={filterStatus === 'archived' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilterStatus('archived')}
                            >
                                Archived
                            </Button>
                        </div>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="oldest">Oldest First</option>
                            <option value="priority">By Priority</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-6">
                    {historicalIssues.length === 0 ? (
                        <div className="text-center py-12">
                            <History className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No Historical Tasks Found</h3>
                            <p className="text-muted-foreground">Complete some tasks or wait 30 days to see archived items here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {historicalIssues.map(issue => (
                                <div
                                    key={issue.id}
                                    onClick={() => navigate(`/issues/${issue.id}`)}
                                    className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xs font-mono text-muted-foreground px-2 py-1 bg-muted/50 rounded">
                                                    {issue.issue_key}
                                                </span>
                                                <span className={cn(
                                                    "text-xs px-2 py-1 rounded font-semibold uppercase",
                                                    issue.status === 'done' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                                                )}>
                                                    {issue.status === 'done' ? 'Completed' : issue.status.replace('_', ' ')}
                                                </span>
                                                {issue.priority && (
                                                    <span className={cn(
                                                        "text-xs px-2 py-1 rounded",
                                                        issue.priority === 'blocker' || issue.priority === 'critical' ? 'bg-red-500/20 text-red-500' :
                                                        issue.priority === 'major' ? 'bg-orange-500/20 text-orange-500' :
                                                        'bg-blue-500/20 text-blue-500'
                                                    )}>
                                                        {issue.priority}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {issue.summary}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Created {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                                                </span>
                                                {issue.resolved_at && (
                                                    <span className="flex items-center gap-1 text-green-500">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Completed {formatDistanceToNow(new Date(issue.resolved_at), { addSuffix: true })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
