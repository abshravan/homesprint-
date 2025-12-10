import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateBoardDto } from '../../shared/types/board.types';
import { getBoardService } from '../../services/board.service';

const boardService = getBoardService();

export const useBoards = () => {
    return useQuery({
        queryKey: ['boards'],
        queryFn: () => boardService.getAll(),
    });
};

export const useCreateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (board: CreateBoardDto) => boardService.create(board),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
    });
};
