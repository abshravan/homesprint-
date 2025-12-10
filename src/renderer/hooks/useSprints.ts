import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateSprintDto } from '../../shared/types/sprint.types';

export const useSprints = (boardId: number) => {
    return useQuery({
        queryKey: ['sprints', boardId],
        queryFn: () => window.api.sprints.getByBoardId(boardId),
        enabled: !!boardId,
    });
};

export const useCreateSprint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sprint: CreateSprintDto) => window.api.sprints.create(sprint),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['sprints', variables.board_id] });
        },
    });
};

export const useStartSprint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => window.api.sprints.start(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sprints'] });
        },
    });
};

export const useCloseSprint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => window.api.sprints.close(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sprints'] });
        },
    });
};
