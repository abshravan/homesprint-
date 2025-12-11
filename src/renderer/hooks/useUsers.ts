import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserService } from '../../services/user.service';
import { CreateUserDto } from '../../shared/types/user.types';

const userService = getUserService();

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => userService.getAll(),
    });
};

export const useUser = (id: number) => {
    return useQuery({
        queryKey: ['users', id],
        queryFn: () => userService.getById(id),
        enabled: !!id,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: CreateUserDto) => userService.create(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
