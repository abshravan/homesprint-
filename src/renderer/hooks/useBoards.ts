import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateBoardDto } from '../../shared/types/board.types';

export const useBoards = () => {
    return useQuery({
        queryKey: ['boards'],
        queryFn: () => window.api.boards.getAll(),
    });
};

export const useCreateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (board: CreateBoardDto) => window.api.boards.create(board),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
    });
};
