import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCommentDto } from '../../shared/types/comment.types';
import { getCommentService } from '../../services/comment.service';

const commentService = getCommentService();

export const useComments = (issueId: number) => {
    return useQuery({
        queryKey: ['comments', issueId],
        queryFn: () => commentService.getByIssueId(issueId),
        enabled: !!issueId,
    });
};

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (comment: CreateCommentDto) => commentService.create(comment),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['comments', variables.issue_id] });
        },
    });
};
