import { useQuery } from '@tanstack/react-query';
import { getHistoryService } from '../../services/history.service';
import { IssueHistoryWithUser } from '../../shared/types/history.types';

const historyService = getHistoryService();

export const useIssueHistory = (issueId: number | undefined) => {
    return useQuery<IssueHistoryWithUser[]>({
        queryKey: ['issue-history', issueId],
        queryFn: () => {
            if (!issueId) {
                return Promise.resolve([]);
            }
            return historyService.getByIssueIdWithUsers(issueId);
        },
        enabled: !!issueId,
    });
};
