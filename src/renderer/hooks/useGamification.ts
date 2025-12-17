import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGamificationService } from '../../services/gamification.service';
import { CreateExcuseDto } from '../../shared/types/gamification.types';

const gamificationService = getGamificationService();

export const useUserStats = (userId: number) => {
    return useQuery({
        queryKey: ['user-stats', userId],
        queryFn: () => gamificationService.getUserStats(userId),
        enabled: !!userId,
    });
};

export const useUserAchievements = (userId: number) => {
    return useQuery({
        queryKey: ['user-achievements', userId],
        queryFn: () => gamificationService.getUserAchievements(userId),
        enabled: !!userId,
    });
};

export const useLeaderboard = (limit: number = 10) => {
    return useQuery({
        queryKey: ['leaderboard', limit],
        queryFn: () => gamificationService.getLeaderboard(limit),
    });
};

export const useProcrastinationLeaderboard = (limit: number = 10) => {
    return useQuery({
        queryKey: ['procrastination-leaderboard', limit],
        queryFn: () => gamificationService.getProcrastinationLeaderboard(limit),
    });
};

export const useAllExcuses = () => {
    return useQuery({
        queryKey: ['excuses'],
        queryFn: () => gamificationService.getAllExcuses(),
    });
};

export const useRandomExcuse = () => {
    return useQuery({
        queryKey: ['excuse-random'],
        queryFn: () => gamificationService.getRandomExcuse(),
        staleTime: 0, // Always fetch fresh
    });
};

export const useTopExcuses = (limit: number = 5) => {
    return useQuery({
        queryKey: ['excuses-top', limit],
        queryFn: () => gamificationService.getTopRatedExcuses(limit),
    });
};

export const useCreateExcuse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (excuse: CreateExcuseDto) => gamificationService.createExcuse(excuse),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['excuses'] });
        },
    });
};

export const useExcuse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (excuseId: number) => gamificationService.useExcuse(excuseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['excuses'] });
        },
    });
};

export const useRateExcuse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: { excuseId: number; rating: number }) =>
            gamificationService.rateExcuse(params.excuseId, params.rating),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['excuses'] });
        },
    });
};
