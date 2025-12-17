export interface UserStats {
    id: number;
    user_id: number;
    total_points: number;
    current_streak: number;
    longest_streak: number;
    tasks_completed: number;
    tasks_abandoned: number;
    last_completion_date?: string;
    level: number;
    updated_at: string;
}

export interface UserStatsWithUser extends UserStats {
    username: string;
    display_name: string;
    avatar_url?: string;
}

export interface UserAchievement {
    id: number;
    user_id: number;
    achievement_id: string;
    earned_at: string;
    progress?: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'completion' | 'streak' | 'speed' | 'social' | 'parody';
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    requirement: number;
    points: number;
}

export interface Excuse {
    id: number;
    category: string;
    text: string;
    severity: 'minor' | 'moderate' | 'critical';
    usage_count: number;
    rating: number;
    created_at: string;
}

export interface CreateExcuseDto {
    category: string;
    text: string;
    severity: 'minor' | 'moderate' | 'critical';
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
    // Completion achievements
    { id: 'first_task', name: 'Baby Steps', description: 'Complete your first task', icon: '🎯', category: 'completion', tier: 'bronze', requirement: 1, points: 10 },
    { id: 'task_10', name: 'Getting Started', description: 'Complete 10 tasks', icon: '✅', category: 'completion', tier: 'bronze', requirement: 10, points: 50 },
    { id: 'task_50', name: 'Productive', description: 'Complete 50 tasks', icon: '🔥', category: 'completion', tier: 'silver', requirement: 50, points: 200 },
    { id: 'task_100', name: 'Unstoppable', description: 'Complete 100 tasks', icon: '💪', category: 'completion', tier: 'gold', requirement: 100, points: 500 },
    { id: 'task_500', name: 'Legend', description: 'Complete 500 tasks', icon: '🏆', category: 'completion', tier: 'platinum', requirement: 500, points: 2000 },

    // Streak achievements
    { id: 'streak_3', name: 'On a Roll', description: '3-day completion streak', icon: '🔆', category: 'streak', tier: 'bronze', requirement: 3, points: 30 },
    { id: 'streak_7', name: 'Week Warrior', description: '7-day completion streak', icon: '⭐', category: 'streak', tier: 'silver', requirement: 7, points: 100 },
    { id: 'streak_30', name: 'Monthly Master', description: '30-day completion streak', icon: '🌟', category: 'streak', tier: 'gold', requirement: 30, points: 500 },
    { id: 'streak_100', name: 'Streak Legend', description: '100-day completion streak', icon: '💎', category: 'streak', tier: 'platinum', requirement: 100, points: 2000 },

    // Speed achievements
    { id: 'speed_1h', name: 'Quick Draw', description: 'Complete a task within 1 hour of creation', icon: '⚡', category: 'speed', tier: 'bronze', requirement: 1, points: 25 },
    { id: 'speed_10', name: 'Speedrunner', description: 'Complete 10 tasks within 1 hour each', icon: '🚀', category: 'speed', tier: 'silver', requirement: 10, points: 150 },

    // Parody achievements
    { id: 'excuse_5', name: 'Creative Procrastinator', description: 'Use 5 different excuses', icon: '🎭', category: 'parody', tier: 'bronze', requirement: 5, points: 20 },
    { id: 'excuse_master', name: 'Excuse Master', description: 'Use all excuse categories', icon: '🎪', category: 'parody', tier: 'gold', requirement: 10, points: 300 },
    { id: 'netflix_10', name: 'Binge Watcher', description: 'Log 10+ Netflix episodes on tasks', icon: '📺', category: 'parody', tier: 'silver', requirement: 10, points: 100 },
    { id: 'overdue_30', name: 'Procrastination Pro', description: 'Have a task overdue by 30+ days', icon: '🐌', category: 'parody', tier: 'gold', requirement: 30, points: 250 },
    { id: 'spouse_approval', name: 'Spouse Whisperer', description: 'Get 5 spouse approvals', icon: '💑', category: 'parody', tier: 'silver', requirement: 5, points: 150 },
    { id: 'midnight_oil', name: 'Midnight Oil', description: 'Complete a task after midnight', icon: '🌙', category: 'parody', tier: 'bronze', requirement: 1, points: 50 },
];

// Calculate level from points
export function calculateLevel(points: number): number {
    // Level 1: 0-99 points
    // Level 2: 100-299 points
    // Level 3: 300-599 points
    // etc. (exponential growth)
    if (points < 100) return 1;
    if (points < 300) return 2;
    if (points < 600) return 3;
    if (points < 1000) return 4;
    if (points < 1500) return 5;
    if (points < 2100) return 6;
    if (points < 2800) return 7;
    if (points < 3600) return 8;
    if (points < 4500) return 9;
    if (points < 5500) return 10;
    return 10 + Math.floor((points - 5500) / 1000);
}

// Calculate points needed for next level
export function pointsForNextLevel(currentLevel: number): number {
    const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];
    if (currentLevel < levels.length) {
        return levels[currentLevel];
    }
    return 5500 + ((currentLevel - 10) * 1000);
}
