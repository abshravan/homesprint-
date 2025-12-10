import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateSprintDto } from '../../shared/types/sprint.types';
import { getSprintService } from '../../services/sprint.service';

const sprintService = getSprintService();

export const useSprints = (boardId: number) => {
    return useQuery({
        queryKey: ['sprints', boardId],
        queryFn: () => sprintService.getByBoardId(boardId),
        enabled: !!boardId,
    });
};

export const useCreateSprint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sprint: CreateSprintDto) => sprintService.create(sprint),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['sprints', variables.board_id] });
        },
    });
};

export const useStartSprint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => sprintService.startSprint(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sprints'] });
        },
    });
};

export const useCloseSprint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => sprintService.closeSprint(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sprints'] });
        },
    });
};
