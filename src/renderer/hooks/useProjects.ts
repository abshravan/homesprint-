import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjectService } from '../../services/project.service';
import { CreateProjectDto } from '../../shared/types/project.types';

const projectService = getProjectService();

export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: () => projectService.getAll(),
    });
};

export const useProject = (id: number) => {
    return useQuery({
        queryKey: ['projects', id],
        queryFn: () => projectService.getById(id),
        enabled: !!id,
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (project: CreateProjectDto) => projectService.create(project),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateProjectDto> }) =>
            projectService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => projectService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};
