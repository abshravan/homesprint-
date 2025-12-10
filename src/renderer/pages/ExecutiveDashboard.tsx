import { useDashboardStats } from '../hooks/useDashboard';
import { useIssues } from '../hooks/useIssues';
import { Loader2, TrendingUp, TrendingDown, Minus, Award, Frown } from 'lucide-react';

export const ExecutiveDashboard = () => {
    const { data: stats, isLoading } = useDashboardStats();
    const { data: issues } = useIssues();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Calculate fake executive metrics
    const synergy = Math.floor(Math.random() * 30) + 40; // 40-70%
    const roi = Math.floor(Math.random() * 200) - 50; // -50 to 150%
    const kpi = Math.floor(Math.random() * 100);
    const bandwidth = Math.floor(Math.random() * 40) + 20; // 20-60%

    // Top procrastinators (issues with high procrastination)
    const procrastinatedIssues = issues?.filter(i => i.procrastination_level === 'high' || i.procrastination_level === 'extreme') || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Executive Overview Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Meaningless metrics to impress stakeholders (your spouse)
                </p>
            </div>

            {/* Buzzword Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Synergy Index</h3>
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold mt-2">{synergy}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        ↑ 12% from last quarter (we made this up)
                    </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg border border-green-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Household ROI</h3>
                        {roi > 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
                    </div>
                    <div className={`text-3xl font-bold mt-2 ${roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roi > 0 ? '+' : ''}{roi}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Return on Ignored Tasks
                    </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg border border-purple-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">KPI Score</h3>
                        <Minus className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold mt-2">{kpi}/100</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Key Procrastination Indicator
                    </p>
                </div>

                <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">Bandwidth</h3>
                        <TrendingDown className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-3xl font-bold mt-2">{bandwidth}%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Available motivation remaining
                    </p>
                </div>
            </div>

            {/* Strategic Initiatives (aka things we keep talking about) */}
            <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Award className="mr-2 h-5 w-5 text-amber-600" />
                    Strategic Initiatives
                </h2>
                <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                            <h3 className="font-medium">Digital Transformation</h3>
                            <p className="text-sm text-muted-foreground">
                                Moving task list from fridge to digital platform (this app)
                            </p>
                            <div className="mt-2">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-3/4"></div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">75% complete (estimate)</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                            <h3 className="font-medium">Process Optimization</h3>
                            <p className="text-sm text-muted-foreground">
                                Finding faster ways to ignore tasks
                            </p>
                            <div className="mt-2">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-1/2"></div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">50% complete</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                            <h3 className="font-medium">Stakeholder Alignment</h3>
                            <p className="text-sm text-muted-foreground">
                                Getting spouse to agree on priorities
                            </p>
                            <div className="mt-2">
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 w-1/4"></div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">25% complete (stalled)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* High Risk Items */}
            {procrastinatedIssues.length > 0 && (
                <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Frown className="mr-2 h-5 w-5 text-destructive" />
                        High-Risk Items
                    </h2>
                    <div className="space-y-2">
                        {procrastinatedIssues.slice(0, 5).map((issue) => (
                            <div key={issue.id} className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                                <div>
                                    <span className="font-mono text-sm text-muted-foreground">{issue.issue_key}</span>
                                    <p className="font-medium">{issue.summary}</p>
                                </div>
                                <span className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full uppercase font-semibold">
                                    {issue.procrastination_level}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Executive Summary */}
            <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Executive Summary</h2>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p className="mb-3">
                        <strong className="text-foreground">Q4 Performance:</strong> The household continues to leverage
                        synergies across core competencies. Our strategic pivot towards "getting things done eventually"
                        has yielded mixed results, with completion rates remaining steady at {stats?.totalIssues ? Math.round((stats.completedIssues / stats.totalIssues) * 100) : 0}%.
                    </p>
                    <p className="mb-3">
                        <strong className="text-foreground">Key Challenges:</strong> Resource bandwidth continues to be
                        constrained by Netflix subscriptions and social media engagement. We're seeing increased
                        velocity in excuse generation but decreased throughput in actual task completion.
                    </p>
                    <p>
                        <strong className="text-foreground">Forward Outlook:</strong> Moving forward, we're committed to
                        a data-driven approach to household management, which means we'll continue tracking everything
                        while accomplishing nothing. This aligns with our core value of looking productive.
                    </p>
                </div>
            </div>
        </div>
    );
};
