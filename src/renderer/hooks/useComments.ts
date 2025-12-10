import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCommentDto } from '../../shared/types/comment.types';

export const useComments = (issueId: number) => {
    return useQuery({
        queryKey: ['comments', issueId],
        queryFn: () => window.api.comments.getByIssueId(issueId),
        enabled: !!issueId,
    });
};

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (comment: CreateCommentDto) => window.api.comments.create(comment),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.issue_id] });
        },
    });
};
