import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateIssueDto } from '../../shared/types/issue.types';

export const useIssues = () => {
    return useQuery({
        queryKey: ['issues'],
        queryFn: () => window.api.issues.getAll(),
    });
};

export const useCreateIssue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (issue: CreateIssueDto) => window.api.issues.create(issue),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] });
        },
    });
};

export const useUpdateIssueStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => window.api.issues.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] });
        },
    });
};
