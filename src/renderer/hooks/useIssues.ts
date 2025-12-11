import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateIssueDto, Issue } from '../../shared/types/issue.types';
import { getIssueService } from '../../services/issue.service';

const issueService = getIssueService();

export const useIssues = () => {
    return useQuery({
        queryKey: ['issues'],
        queryFn: () => issueService.getAll(),
    });
};

export const useCreateIssue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (issue: CreateIssueDto) => issueService.create(issue),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] });
        },
    });
};

export const useUpdateIssueStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => issueService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] });
        },
    });
};

export const useUpdateIssue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<Issue> }) => issueService.update(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] });
        },
    });
};

export const useDeleteIssue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => issueService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['issues'] });
        },
    });
};
