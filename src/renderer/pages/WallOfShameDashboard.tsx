import { useIssues } from '../hooks/useIssues';
import { Loader2, Flame, Calendar, Trophy, Skull } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const WallOfShameDashboard = () => {
    const { data: issues, isLoading } = useIssues();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const now = new Date();

    // Categorize shameful tasks
    const overdueIssues = issues?.filter(
        i => i.due_date && new Date(i.due_date) < now && i.status !== 'done'
    ).sort((a, b) => {
        const daysOverdueA = Math.floor((now.getTime() - new Date(a.due_date!).getTime()) / (1000 * 60 * 60 * 24));
        const daysOverdueB = Math.floor((now.getTime() - new Date(b.due_date!).getTime()) / (1000 * 60 * 60 * 24));
        return daysOverdueB - daysOverdueA;
    }) || [];

    const ancientTasks = issues?.filter(
        i => i.status !== 'done' &&
        new Date(i.created_at).getTime() < now.getTime() - (90 * 24 * 60 * 60 * 1000) // older than 90 days
    ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || [];

    const extremeProcrastination = issues?.filter(
        i => i.status !== 'done' && i.procrastination_level === 'extreme'
    ) || [];

    const spouseApprovalRequired = issues?.filter(
        i => i.status !== 'done' && i.spouse_approval_required
    ) || [];

    // Hall of Shame - worst offenders
    const hallOfShame = [...overdueIssues].slice(0, 3);

    const getDaysOverdue = (dueDate: string) => {
        return Math.floor((now.getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
    };

    const getShameLevel = (daysOverdue: number) => {
        if (daysOverdue > 180) return { level: 'Legendary', color: 'text-purple-600', bg: 'bg-purple-500/10' };
        if (daysOverdue > 90) return { level: 'Epic', color: 'text-red-600', bg: 'bg-red-500/10' };
        if (daysOverdue > 30) return { level: 'Serious', color: 'text-orange-600', bg: 'bg-orange-500/10' };
        return { level: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-500/10' };
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center">
                    <Flame className="mr-3 h-8 w-8 text-orange-600" />
                    Wall of Shame
                </h1>
                <p className="text-muted-foreground mt-1">
                    A monument to procrastination and broken promises
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Overdue Tasks</h3>
                    <div className="text-3xl font-bold text-destructive">{overdueIssues.length}</div>
                    <p className="text-xs text-muted-foreground">Promises broken</p>
                </div>

                <div className="p-6 bg-purple-500/10 rounded-lg border border-purple-200 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Ancient Tasks</h3>
                    <div className="text-3xl font-bold text-purple-600">{ancientTasks.length}</div>
                    <p className="text-xs text-muted-foreground">Older than 90 days</p>
                </div>

                <div className="p-6 bg-orange-500/10 rounded-lg border border-orange-200 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Extreme Procrastination</h3>
                    <div className="text-3xl font-bold text-orange-600">{extremeProcrastination.length}</div>
                    <p className="text-xs text-muted-foreground">Maximum avoidance</p>
                </div>

                <div className="p-6 bg-pink-500/10 rounded-lg border border-pink-200 shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Needs Approval</h3>
                    <div className="text-3xl font-bold text-pink-600">{spouseApprovalRequired.length}</div>
                    <p className="text-xs text-muted-foreground">Waiting for permission</p>
                </div>
            </div>

            {/* Hall of Shame - Top 3 */}
            {hallOfShame.length > 0 && (
                <div className="bg-card rounded-lg border border-destructive/20 p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-amber-600" />
                        Hall of Shame - Top Offenders
                    </h2>
                    <div className="space-y-4">
                        {hallOfShame.map((issue, index) => {
                            const daysOverdue = getDaysOverdue(issue.due_date!);
                            const shame = getShameLevel(daysOverdue);
                            return (
                                <div key={issue.id} className={`p-5 ${shame.bg} border rounded-lg relative`}>
                                    {/* Rank Badge */}
                                    <div className="absolute -left-3 -top-3 bg-background border-2 border-destructive rounded-full h-10 w-10 flex items-center justify-center">
                                        <span className="text-lg font-bold text-destructive">#{index + 1}</span>
                                    </div>

                                    <div className="ml-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="font-mono text-sm text-muted-foreground">{issue.issue_key}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${shame.color} bg-background/50`}>
                                                        {shame.level}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-lg mb-2">{issue.summary}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center">
                                                        <Calendar className="mr-1 h-3 w-3" />
                                                        Due: {new Date(issue.due_date!).toLocaleDateString()}
                                                    </span>
                                                    <span className={`font-bold ${shame.color}`}>
                                                        <Flame className="inline-block mr-1 h-4 w-4" />
                                                        {daysOverdue} days overdue
                                                    </span>
                                                </div>
                                                {issue.description && (
                                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                        {issue.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Ancient Tasks Section */}
            {ancientTasks.length > 0 && (
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Skull className="mr-2 h-5 w-5 text-purple-600" />
                        Ancient Artifacts (90+ Days Old)
                    </h2>
                    <div className="space-y-2">
                        {ancientTasks.slice(0, 8).map((issue) => (
                            <div key={issue.id} className="flex items-center justify-between p-3 bg-purple-500/5 border border-purple-200 rounded-lg hover:bg-purple-500/10 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-mono text-xs text-muted-foreground">{issue.issue_key}</span>
                                        <span className="font-medium">{issue.summary}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Created {formatDistanceToNow(new Date(issue.created_at), { addSuffix: true })}
                                    </p>
                                </div>
                                <span className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full">
                                    Ancient
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Extreme Procrastination */}
            {extremeProcrastination.length > 0 && (
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Extreme Procrastination Zone</h2>
                    <div className="grid gap-3 md:grid-cols-2">
                        {extremeProcrastination.map((issue) => (
                            <div key={issue.id} className="p-4 bg-orange-500/5 border border-orange-200 rounded-lg">
                                <span className="font-mono text-xs text-muted-foreground">{issue.issue_key}</span>
                                <h3 className="font-medium mt-1">{issue.summary}</h3>
                                <div className="flex items-center space-x-2 mt-2">
                                    {issue.netflix_episodes && issue.netflix_episodes > 0 && (
                                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                            📺 {issue.netflix_episodes} episodes watched instead
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {overdueIssues.length === 0 && ancientTasks.length === 0 && extremeProcrastination.length === 0 && (
                <div className="bg-card rounded-lg border p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                        <Trophy className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No Shame to Display!</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Congratulations! You either have no overdue tasks, or you haven't created any tasks yet.
                        Either way, you're winning at household management... or avoiding it entirely.
                    </p>
                </div>
            )}

            {/* Motivational Quote */}
            <div className="bg-muted/30 rounded-lg border p-6 text-center">
                <p className="text-lg italic text-muted-foreground">
                    "The best time to plant a tree was 20 years ago. The second best time is to add it to your backlog and mark it as low priority."
                </p>
                <p className="text-sm text-muted-foreground mt-2">— Ancient Proverb (Probably)</p>
            </div>
        </div>
    );
};
