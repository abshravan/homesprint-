import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserStats, useUserAchievements, useLeaderboard, useAllExcuses, useRandomExcuse, useTopExcuses } from '../hooks/useGamification';
import { ACHIEVEMENTS, pointsForNextLevel, Achievement } from '../../shared/types/gamification.types';
import { Loader2, Trophy, Flame, TrendingUp, Zap, Award, Copy, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

export const AchievementsPage = () => {
    const { user } = useAuth();
    const [copiedExcuse, setCopiedExcuse] = useState<number | null>(null);

    const { data: stats, isLoading: isLoadingStats } = useUserStats(user?.id || 0);
    const { data: achievements, isLoading: isLoadingAchievements } = useUserAchievements(user?.id || 0);
    const { data: leaderboard } = useLeaderboard(10);
    const { data: allExcuses } = useAllExcuses();
    const { data: randomExcuse, refetch: getNewExcuse } = useRandomExcuse();
    const { data: topExcuses } = useTopExcuses(5);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Please log in to view achievements</p>
            </div>
        );
    }

    if (isLoadingStats || isLoadingAchievements) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const earnedAchievementIds = achievements?.map(a => a.achievement_id) || [];
    const earnedAchievements = ACHIEVEMENTS.filter((a: Achievement) => earnedAchievementIds.includes(a.id));
    const lockedAchievements = ACHIEVEMENTS.filter((a: Achievement) => !earnedAchievementIds.includes(a.id));

    const userRank = leaderboard?.findIndex(s => s.user_id === user.id) ?? -1;
    const pointsToNext = stats ? pointsForNextLevel(stats.level) - stats.total_points : 0;
    const progressPercent = stats ? (stats.total_points / pointsForNextLevel(stats.level)) * 100 : 0;

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'bronze': return 'text-amber-700 bg-amber-100 border-amber-300 dark:bg-amber-950/30';
            case 'silver': return 'text-gray-600 bg-gray-100 border-gray-300 dark:bg-gray-900/30';
            case 'gold': return 'text-yellow-600 bg-yellow-100 border-yellow-300 dark:bg-yellow-950/30';
            case 'platinum': return 'text-purple-600 bg-purple-100 border-purple-300 dark:bg-purple-950/30';
            default: return 'text-muted-foreground bg-muted';
        }
    };

    const copyExcuse = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedExcuse(id);
        setTimeout(() => setCopiedExcuse(null), 2000);
    };

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center">
                    <Trophy className="mr-3 h-8 w-8 text-primary" />
                    Achievements & Stats
                </h1>
                <p className="text-muted-foreground mt-1">
                    Track your progress, earn badges, and embrace procrastination
                </p>
            </div>

            {/* User Stats Summary */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-gradient-teal rounded-lg shadow-lg text-primary-foreground">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">Level</h3>
                        <Zap className="h-5 w-5 opacity-75" />
                    </div>
                    <div className="text-4xl font-bold">{stats?.level || 1}</div>
                    <div className="mt-3">
                        <div className="flex items-center justify-between text-xs opacity-90 mb-1">
                            <span>{stats?.total_points || 0} XP</span>
                            <span>{pointsForNextLevel(stats?.level || 1)} XP</span>
                        </div>
                        <div className="w-full bg-primary-foreground/30 rounded-full h-2">
                            <div
                                className="bg-primary-foreground h-2 rounded-full transition-all"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <p className="text-xs opacity-75 mt-1">{pointsToNext} XP to next level</p>
                    </div>
                </div>

                <div className="p-6 bg-card border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Current Streak</h3>
                        <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="text-4xl font-bold text-orange-600">{stats?.current_streak || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Longest: {stats?.longest_streak || 0} days
                    </p>
                </div>

                <div className="p-6 bg-card border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Tasks Completed</h3>
                        <Trophy className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-4xl font-bold text-green-600">{stats?.tasks_completed || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {stats?.tasks_abandoned || 0} abandoned
                    </p>
                </div>

                <div className="p-6 bg-card border rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Global Rank</h3>
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary">
                        {userRank >= 0 ? `#${userRank + 1}` : '-'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        of {leaderboard?.length || 0} users
                    </p>
                </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <Award className="mr-2 h-6 w-6 text-primary" />
                    Achievements
                    <span className="ml-3 text-sm font-normal text-muted-foreground">
                        {earnedAchievements.length} / {ACHIEVEMENTS.length} unlocked
                    </span>
                </h2>

                {/* Earned Achievements */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Earned Badges</h3>
                    {earnedAchievements.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {earnedAchievements.map((achievement: Achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`p-4 rounded-lg border-2 ${getTierColor(achievement.tier)} shadow-sm`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-3xl">{achievement.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold">{achievement.name}</h4>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-background/50 capitalize">
                                                    {achievement.tier}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {achievement.description}
                                            </p>
                                            <p className="text-xs font-semibold mt-2">
                                                +{achievement.points} XP
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">
                                Complete tasks to earn your first achievement!
                            </p>
                        </div>
                    )}
                </div>

                {/* Locked Achievements */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Locked Badges</h3>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {lockedAchievements.map((achievement: Achievement) => (
                            <div
                                key={achievement.id}
                                className="p-4 rounded-lg border bg-muted/30 opacity-60"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl grayscale">{achievement.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold">???</h4>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-background/50 capitalize">
                                                {achievement.tier}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {achievement.description}
                                        </p>
                                        <p className="text-xs font-semibold mt-2 text-muted-foreground">
                                            +{achievement.points} XP
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Excuse Library */}
            <div className="bg-card rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <Sparkles className="mr-2 h-6 w-6 text-purple-600" />
                    Excuse Generator
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Need a creative reason for that overdue task? We've got you covered!
                </p>

                {/* Random Excuse Generator */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-6 mb-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            {randomExcuse ? (
                                <>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-600 text-white">
                                            {randomExcuse.category}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            ⭐ {randomExcuse.rating.toFixed(1)}/5.0
                                        </span>
                                    </div>
                                    <p className="text-lg font-medium italic">
                                        "{randomExcuse.text}"
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Used {randomExcuse.usage_count} times by fellow procrastinators
                                    </p>
                                </>
                            ) : (
                                <p className="text-muted-foreground">Loading excuse...</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {randomExcuse && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyExcuse(randomExcuse.text, randomExcuse.id)}
                                >
                                    {copiedExcuse === randomExcuse.id ? (
                                        <>✓ Copied</>
                                    ) : (
                                        <><Copy className="h-4 w-4 mr-1" /> Copy</>
                                    )}
                                </Button>
                            )}
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => getNewExcuse()}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                <RefreshCw className="h-4 w-4 mr-1" /> New Excuse
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Top Rated Excuses */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Hall of Fame Excuses</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                        {topExcuses?.map((excuse) => (
                            <div
                                key={excuse.id}
                                className="p-4 bg-muted/50 border rounded-lg hover:bg-muted transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-background">
                                                {excuse.category}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                ⭐ {excuse.rating.toFixed(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm italic">"{excuse.text}"</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyExcuse(excuse.text, excuse.id)}
                                    >
                                        {copiedExcuse === excuse.id ? '✓' : <Copy className="h-3 w-3" />}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 text-center text-xs text-muted-foreground">
                    {allExcuses?.length || 0} excuses in the library
                </div>
            </div>
        </div>
    );
};
