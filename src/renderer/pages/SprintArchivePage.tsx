import {
    Archive,
    Calendar,
    TrendingUp,
    CheckCircle,
    Clock,
    Target,
    Zap,
} from 'lucide-react';

export const SprintArchivePage = () => {
    // Mock sprint data for demonstration
    const archivedSprints = [
        {
            id: 1,
            name: 'Spring Cleaning Sprint',
            goal: 'Get the house in order before summer',
            startDate: '2024-01-15',
            endDate: '2024-01-29',
            status: 'closed',
            issuesCompleted: 12,
            issuesTotal: 15,
            velocity: 23,
        },
        {
            id: 2,
            name: 'Home Improvement Blitz',
            goal: 'Fix all the things we\'ve been avoiding',
            startDate: '2024-02-01',
            endDate: '2024-02-14',
            status: 'closed',
            issuesCompleted: 8,
            issuesTotal: 12,
            velocity: 18,
        },
        {
            id: 3,
            name: 'Garage Organization',
            goal: 'Actually be able to park in the garage',
            startDate: '2024-02-15',
            endDate: '2024-02-28',
            status: 'closed',
            issuesCompleted: 10,
            issuesTotal: 10,
            velocity: 25,
        },
    ];

    const completionRate = (completed: number, total: number) => Math.round((completed / total) * 100);

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="bg-gradient-teal-dark p-6 border-b border-primary/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Archive className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Sprint Archive</h1>
                            <p className="text-teal-100 text-sm">Review past sprint performance and velocity</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Sprints</p>
                                    <p className="text-2xl font-bold text-primary mt-1">{archivedSprints.length}</p>
                                </div>
                                <Zap className="h-8 w-8 text-primary/50" />
                            </div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 border border-green-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Completion</p>
                                    <p className="text-2xl font-bold text-green-500 mt-1">
                                        {Math.round(archivedSprints.reduce((sum, s) => sum + completionRate(s.issuesCompleted, s.issuesTotal), 0) / archivedSprints.length)}%
                                    </p>
                                </div>
                                <Target className="h-8 w-8 text-green-500/50" />
                            </div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Velocity</p>
                                    <p className="text-2xl font-bold text-blue-500 mt-1">
                                        {Math.round(archivedSprints.reduce((sum, s) => sum + s.velocity, 0) / archivedSprints.length)}
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-blue-500/50" />
                            </div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-4 border border-amber-500/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Issues Done</p>
                                    <p className="text-2xl font-bold text-amber-500 mt-1">
                                        {archivedSprints.reduce((sum, s) => sum + s.issuesCompleted, 0)}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-amber-500/50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sprint List */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="space-y-4">
                        {archivedSprints.map((sprint) => {
                            const completion = completionRate(sprint.issuesCompleted, sprint.issuesTotal);

                            return (
                                <div
                                    key={sprint.id}
                                    className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group"
                                >
                                    {/* Sprint Header */}
                                    <div className="p-5 border-b border-border bg-muted/20">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                                                    {sprint.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground italic">
                                                    "{sprint.goal}"
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-semibold uppercase">
                                                    Closed
                                                </span>
                                                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold">
                                                    {completion}% Complete
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-sm">
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                {Math.ceil((new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                            </span>
                                        </div>
                                    </div>

                                    {/* Sprint Stats */}
                                    <div className="p-5 grid grid-cols-3 gap-4">
                                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Velocity</p>
                                            <p className="text-xl font-bold text-primary">{sprint.velocity}</p>
                                        </div>
                                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Completed</p>
                                            <p className="text-xl font-bold text-green-500">{sprint.issuesCompleted}/{sprint.issuesTotal}</p>
                                        </div>
                                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Success Rate</p>
                                            <p className="text-xl font-bold text-blue-500">{completion}%</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="px-5 pb-5">
                                        <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-teal rounded-full transition-all"
                                                style={{ width: `${completion}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State (for when no sprints) */}
                    {archivedSprints.length === 0 && (
                        <div className="text-center py-16">
                            <Archive className="h-20 w-20 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No Archived Sprints Yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Complete your first sprint to see it archived here
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
