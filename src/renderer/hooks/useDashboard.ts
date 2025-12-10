import { useQuery } from '@tanstack/react-query';
import { getIssueService } from '../../services/issue.service';

const issueService = getIssueService();

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => issueService.getDashboardStats(),
        refetchInterval: 5000, // Refresh every 5 seconds
    });
};
