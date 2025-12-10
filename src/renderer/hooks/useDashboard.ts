import { useQuery } from '@tanstack/react-query';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => window.api.issues.getDashboardStats(),
        refetchInterval: 5000, // Refresh every 5 seconds
    });
};
