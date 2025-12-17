import { getDatabase } from '../lib/database';
import { UserStats, UserAchievement, Excuse, CreateExcuseDto, ACHIEVEMENTS, calculateLevel } from '../shared/types/gamification.types';

export class GamificationService {
    private db = getDatabase();

    // User Stats Management
    async getUserStats(userId: number): Promise<UserStats | undefined> {
        const stats = await this.db.getAllByIndex('user_stats', 'user_id', userId);
        return stats[0];
    }

    async createUserStats(userId: number): Promise<UserStats> {
        const now = new Date().toISOString();
        const id = await this.db.add('user_stats', {
            user_id: userId,
            total_points: 0,
            current_streak: 0,
            longest_streak: 0,
            tasks_completed: 0,
            tasks_abandoned: 0,
            level: 1,
            updated_at: now,
        });

        const created = await this.db.getById('user_stats', id);
        if (!created) throw new Error('Failed to create user stats');
        return created as UserStats;
    }

    async ensureUserStats(userId: number): Promise<UserStats> {
        let stats = await this.getUserStats(userId);
        if (!stats) {
            stats = await this.createUserStats(userId);
        }
        return stats;
    }

    async updateStreakOnCompletion(userId: number): Promise<void> {
        const stats = await this.ensureUserStats(userId);
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        let newStreak = stats.current_streak;

        if (stats.last_completion_date) {
            const lastDate = new Date(stats.last_completion_date);
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            const lastDateStr = lastDate.toISOString().split('T')[0];

            if (lastDateStr === today) {
                // Already completed today, don't update streak
                return;
            } else if (lastDateStr === yesterdayStr) {
                // Consecutive day
                newStreak += 1;
            } else {
                // Streak broken
                newStreak = 1;
            }
        } else {
            // First completion
            newStreak = 1;
        }

        const newLevel = calculateLevel(stats.total_points + 10);

        await this.db.update('user_stats', {
            ...stats,
            current_streak: newStreak,
            longest_streak: Math.max(newStreak, stats.longest_streak),
            tasks_completed: stats.tasks_completed + 1,
            total_points: stats.total_points + 10, // Base points for completing a task
            last_completion_date: now.toISOString(),
            level: newLevel,
            updated_at: now.toISOString(),
        });

        // Check for new achievements
        await this.checkAndAwardAchievements(userId);
    }

    async addPoints(userId: number, points: number): Promise<void> {
        const stats = await this.ensureUserStats(userId);
        const newTotal = stats.total_points + points;
        const newLevel = calculateLevel(newTotal);

        await this.db.update('user_stats', {
            ...stats,
            total_points: newTotal,
            level: newLevel,
            updated_at: new Date().toISOString(),
        });
    }

    async trackTaskAbandonment(userId: number): Promise<void> {
        const stats = await this.ensureUserStats(userId);

        await this.db.update('user_stats', {
            ...stats,
            tasks_abandoned: stats.tasks_abandoned + 1,
            current_streak: 0, // Break streak on abandonment
            updated_at: new Date().toISOString(),
        });
    }

    // Achievement Management
    async getUserAchievements(userId: number): Promise<UserAchievement[]> {
        return await this.db.getAllByIndex('user_achievements', 'user_id', userId);
    }

    async awardAchievement(userId: number, achievementId: string): Promise<void> {
        // Check if already earned
        const existing = await this.db.getAllByIndex('user_achievements', 'user_id', userId);
        if (existing.some(a => a.achievement_id === achievementId)) {
            return; // Already has this achievement
        }

        // Award the achievement
        await this.db.add('user_achievements', {
            user_id: userId,
            achievement_id: achievementId,
            earned_at: new Date().toISOString(),
        });

        // Add bonus points
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (achievement) {
            await this.addPoints(userId, achievement.points);
        }
    }

    async checkAndAwardAchievements(userId: number): Promise<string[]> {
        const stats = await this.getUserStats(userId);
        if (!stats) return [];

        const newAchievements: string[] = [];

        // Check completion achievements
        if (stats.tasks_completed >= 1) await this.awardAchievement(userId, 'first_task');
        if (stats.tasks_completed >= 10) { await this.awardAchievement(userId, 'task_10'); newAchievements.push('task_10'); }
        if (stats.tasks_completed >= 50) { await this.awardAchievement(userId, 'task_50'); newAchievements.push('task_50'); }
        if (stats.tasks_completed >= 100) { await this.awardAchievement(userId, 'task_100'); newAchievements.push('task_100'); }
        if (stats.tasks_completed >= 500) { await this.awardAchievement(userId, 'task_500'); newAchievements.push('task_500'); }

        // Check streak achievements
        if (stats.current_streak >= 3) { await this.awardAchievement(userId, 'streak_3'); newAchievements.push('streak_3'); }
        if (stats.current_streak >= 7) { await this.awardAchievement(userId, 'streak_7'); newAchievements.push('streak_7'); }
        if (stats.current_streak >= 30) { await this.awardAchievement(userId, 'streak_30'); newAchievements.push('streak_30'); }
        if (stats.current_streak >= 100) { await this.awardAchievement(userId, 'streak_100'); newAchievements.push('streak_100'); }

        return newAchievements.filter(Boolean);
    }

    // Leaderboard
    async getLeaderboard(limit: number = 10): Promise<UserStats[]> {
        const allStats = await this.db.getAll('user_stats');
        return allStats
            .sort((a, b) => b.total_points - a.total_points)
            .slice(0, limit);
    }

    async getProcrastinationLeaderboard(limit: number = 10): Promise<UserStats[]> {
        const allStats = await this.db.getAll('user_stats');
        return allStats
            .sort((a, b) => b.tasks_abandoned - a.tasks_abandoned)
            .slice(0, limit);
    }

    // Excuse Management
    async getAllExcuses(): Promise<Excuse[]> {
        return await this.db.getAll('excuses');
    }

    async getExcusesByCategory(category: string): Promise<Excuse[]> {
        return await this.db.getAllByIndex('excuses', 'category', category);
    }

    async getRandomExcuse(): Promise<Excuse | undefined> {
        const excuses = await this.getAllExcuses();
        if (excuses.length === 0) return undefined;
        return excuses[Math.floor(Math.random() * excuses.length)];
    }

    async getTopRatedExcuses(limit: number = 5): Promise<Excuse[]> {
        const allExcuses = await this.getAllExcuses();
        return allExcuses
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    async createExcuse(excuse: CreateExcuseDto): Promise<Excuse> {
        const id = await this.db.add('excuses', {
            ...excuse,
            usage_count: 0,
            rating: 3.0,
            created_at: new Date().toISOString(),
        });

        const created = await this.db.getById('excuses', id);
        if (!created) throw new Error('Failed to create excuse');
        return created as Excuse;
    }

    async useExcuse(excuseId: number): Promise<void> {
        const excuse = await this.db.getById('excuses', excuseId);
        if (!excuse) return;

        await this.db.update('excuses', {
            ...excuse,
            usage_count: excuse.usage_count + 1,
        });
    }

    async rateExcuse(excuseId: number, newRating: number): Promise<void> {
        const excuse = await this.db.getById('excuses', excuseId);
        if (!excuse) return;

        // Simple average for now
        const avgRating = (excuse.rating * excuse.usage_count + newRating) / (excuse.usage_count + 1);

        await this.db.update('excuses', {
            ...excuse,
            rating: avgRating,
        });
    }
}

// Singleton instance
let gamificationServiceInstance: GamificationService | null = null;

export function getGamificationService(): GamificationService {
    if (!gamificationServiceInstance) {
        gamificationServiceInstance = new GamificationService();
    }
    return gamificationServiceInstance;
}
