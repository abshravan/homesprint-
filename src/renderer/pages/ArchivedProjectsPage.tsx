import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Archive, ArrowLeft, FolderOpen } from 'lucide-react';

export const ArchivedProjectsPage = () => {
    const navigate = useNavigate();

    // Mock archived projects - in reality, would filter projects where archived=true
    const archivedProjects: never[] = [];

    return (
        <div className="space-y-6">
            <div>
                <Button
                    variant="ghost"
                    onClick={() => navigate('/projects')}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Projects
                </Button>
                <div className="flex items-center gap-3">
                    <Archive className="h-8 w-8 text-muted-foreground" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Archived Dreams</h1>
                        <p className="text-muted-foreground">
                            Projects you gave up on... I mean, "completed and archived."
                        </p>
                    </div>
                </div>
            </div>

            {archivedProjects.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-lg border">
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-muted/50 rounded-full mb-4">
                            <Archive className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">No Archived Projects</h2>
                        <p className="text-muted-foreground max-w-md mb-6">
                            You haven't archived any projects yet. Keep going with your current ones,
                            or abandon them here when reality sets in.
                        </p>
                        <Button onClick={() => navigate('/projects')} variant="outline">
                            <FolderOpen className="h-4 w-4 mr-2" />
                            View Active Projects
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {archivedProjects.map((project: any) => (
                        <div
                            key={project.id}
                            className="p-6 bg-card rounded-lg border shadow-sm opacity-75"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-muted rounded-md">
                                    <Archive className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-mono font-bold bg-muted px-2 py-1 rounded text-muted-foreground">
                                    {project.key}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {project.description || 'No description provided'}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                    Archived: {new Date(project.archived_at).toLocaleDateString()}
                                </span>
                                <Button variant="ghost" size="sm">
                                    Restore
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">📦 About Archived Projects</p>
                <p className="text-muted-foreground">
                    Archived projects are hidden from your main project list but their data is preserved.
                    You can restore them at any time, though let's be honest - you probably won't.
                </p>
            </div>
        </div>
    );
};
