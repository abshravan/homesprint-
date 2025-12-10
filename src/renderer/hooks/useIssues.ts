import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateIssueDto } from '../../shared/types/issue.types';
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
