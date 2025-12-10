import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Loader2, Plus, FolderOpen, Calendar } from 'lucide-react';

// Mock project data for now - in a real app, this would come from a hook
const useMockProjects = () => {
    return {
        data: [
            {
                id: 1,
                name: 'HomeSprint',
                key: 'HOME',
                description: 'Family task management and household operations',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        ],
        isLoading: false
    };
};

export const ProjectListPage = () => {
    const navigate = useNavigate();
    const { data: projects, isLoading } = useMockProjects();
    const [isCreating] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading projects...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Your grand plans and abandoned dreams</p>
                </div>
                <Button onClick={() => navigate('/projects/create')} disabled={isCreating} variant="enterprise">
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Create Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects?.map((project) => (
                    <div
                        key={project.id}
                        className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/boards`)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-primary/10 rounded-md">
                                <FolderOpen className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xs font-mono font-bold bg-muted px-2 py-1 rounded text-muted-foreground">
                                {project.key}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {project.description || 'No description provided'}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            Created {new Date(project.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}

                {projects?.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium mb-2">No projects yet</p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Create your first project to start organizing tasks
                        </p>
                        <Button onClick={() => navigate('/projects/create')} variant="enterprise">
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Project
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
