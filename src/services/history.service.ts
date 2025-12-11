import { getDatabase } from '../lib/database';
import { IssueHistory, CreateHistoryDto, IssueHistoryWithUser } from '../shared/types/history.types';
import { getUserService } from './user.service';

export class HistoryService {
    private db = getDatabase();
    private userService = getUserService();

    async getAll(): Promise<IssueHistory[]> {
        const history = await this.db.getAll('issue_history');
        return history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    async getByIssueId(issueId: number): Promise<IssueHistory[]> {
        const history = await this.db.getAllByIndex('issue_history', 'issue_id', issueId);
        return history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    async getByIssueIdWithUsers(issueId: number): Promise<IssueHistoryWithUser[]> {
        const history = await this.getByIssueId(issueId);
        const users = await this.userService.getAll();

        return history.map(h => {
            const user = users.find(u => u.id === h.user_id);
            return {
                ...h,
                user_display_name: user?.display_name || 'Unknown User',
                user_avatar_url: user?.avatar_url,
            };
        });
    }

    async create(historyDto: CreateHistoryDto): Promise<IssueHistory> {
        const now = new Date().toISOString();
        const historyData = {
            ...historyDto,
            created_at: now,
        };

        const id = await this.db.add('issue_history', historyData);
        const created = await this.db.getById('issue_history', id);

        if (!created) {
            throw new Error('Failed to create history entry');
        }

        return created;
    }

    async createMultiple(entries: CreateHistoryDto[]): Promise<void> {
        for (const entry of entries) {
            await this.create(entry);
        }
    }

    async deleteByIssueId(issueId: number): Promise<void> {
        const history = await this.getByIssueId(issueId);
        for (const entry of history) {
            await this.db.delete('issue_history', entry.id);
        }
    }
}

// Singleton instance
let historyServiceInstance: HistoryService | null = null;

export function getHistoryService(): HistoryService {
    if (!historyServiceInstance) {
        historyServiceInstance = new HistoryService();
    }
    return historyServiceInstance;
}
