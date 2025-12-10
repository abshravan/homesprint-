import { useState } from 'react';
import { useSprints, useCreateSprint, useStartSprint, useCloseSprint } from '../../hooks/useSprints';
import { useIssues } from '../../hooks/useIssues';
import { KanbanBoard } from './KanbanBoard';
import { Button } from '../ui/button';
import { Loader2, Plus, Play, CheckSquare, BarChart2 } from 'lucide-react';
import { IssueCard } from './IssueCard';
import { SprintPlanningModal } from './SprintPlanningModal';
import { BurndownChart } from './BurndownChart';

interface ScrumBoardProps {
    boardId: number;
}

export const ScrumBoard = ({ boardId }: ScrumBoardProps) => {
    const { data: sprints, isLoading: isLoadingSprints } = useSprints(boardId);
    const { data: issues, isLoading: isLoadingIssues } = useIssues();
    const createSprint = useCreateSprint();
    const startSprint = useStartSprint();
    const closeSprint = useCloseSprint();

    const [view, setView] = useState<'backlog' | 'active' | 'reports'>('active');
    const [isPlanningOpen, setIsPlanningOpen] = useState(false);
    const [planningSprintId, setPlanningSprintId] = useState<number | null>(null);

    const activeSprint = sprints?.find(s => s.status === 'active');
    const futureSprints = sprints?.filter(s => s.status === 'future') || [];

    // Mock logic: Issues not in any sprint are in backlog
    const backlogIssues = issues?.filter(i => i.status === 'todo' && i.id % 2 !== 0) || [];
    const activeSprintIssues = issues?.filter(i => i.status !== 'todo' || i.id % 2 === 0) || [];

    const handleCreateSprint = () => {
        createSprint.mutate({
            board_id: boardId,
            name: `Sprint ${sprints ? sprints.length + 1 : 1} `,
            goal: 'Survive the week'
        });
    };

    const initiateSprintStart = (id: number) => {
        setPlanningSprintId(id);
        setIsPlanningOpen(true);
    };

    const handleStartSprint = () => {
        if (planningSprintId) {
            startSprint.mutate(planningSprintId);
            setView('active');
        }
    };

    const handleCloseSprint = (id: number) => {
        closeSprint.mutate(id);
    };

    if (isLoadingSprints || isLoadingIssues) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col h-full space-y-4">
            <SprintPlanningModal
                isOpen={isPlanningOpen}
                onClose={() => setIsPlanningOpen(false)}
                onStartSprint={handleStartSprint}
                sprintName={sprints?.find(s => s.id === planningSprintId)?.name || 'Sprint'}
            />

            <div className="flex items-center space-x-2 border-b pb-2">
                <Button
                    variant={view === 'active' ? 'default' : 'ghost'}
                    onClick={() => setView('active')}
                    size="sm"
                >
                    Active Sprint
                </Button>
                <Button
                    variant={view === 'backlog' ? 'default' : 'ghost'}
                    onClick={() => setView('backlog')}
                    size="sm"
                >
                    Backlog
                </Button>
                <Button
                    variant={view === 'reports' ? 'default' : 'ghost'}
                    onClick={() => setView('reports')}
                    size="sm"
                >
                    Reports
                </Button>
            </div>

            <div className="flex-1 overflow-hidden">
                {view === 'active' && (
                    <div className="h-full flex flex-col space-y-4">
                        {activeSprint ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold">{activeSprint.name}</h2>
                                        <p className="text-sm text-muted-foreground">{activeSprint.goal}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button size="sm" variant="outline" onClick={() => setView('reports')}>
                                            <BarChart2 className="h-4 w-4 mr-2" />
                                            Burndown
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleCloseSprint(activeSprint.id)}>
                                            <CheckSquare className="h-4 w-4 mr-2" />
                                            Complete Sprint
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <KanbanBoard issues={activeSprintIssues} />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full space-y-4 text-muted-foreground">
                                <p>No active sprint. Go to backlog to start one.</p>
                                <Button onClick={() => setView('backlog')}>Go to Backlog</Button>
                            </div>
                        )}
                    </div>
                )}

                {view === 'backlog' && (
                    <div className="h-full overflow-y-auto space-y-8 pr-4">
                        {/* Backlog */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">Backlog ({backlogIssues.length} issues)</h3>
                                <Button size="sm" onClick={handleCreateSprint} variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Sprint
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {backlogIssues.map(issue => (
                                    <IssueCard key={issue.id} issue={issue} />
                                ))}
                                {backlogIssues.length === 0 && (
                                    <div className="p-8 border border-dashed rounded text-center text-muted-foreground">
                                        Your backlog is empty. Impossible!
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Future Sprints */}
                        {futureSprints.map(sprint => (
                            <div key={sprint.id} className="space-y-4 border rounded-lg p-4 bg-muted/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold">{sprint.name}</h3>
                                        <p className="text-xs text-muted-foreground">{sprint.goal || 'No goal set'}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-muted-foreground">0 issues</span>
                                        <Button size="sm" onClick={() => initiateSprintStart(sprint.id)} disabled={!!activeSprint}>
                                            <Play className="h-4 w-4 mr-2" />
                                            Start Sprint
                                        </Button>
                                    </div>
                                </div>
                                <div className="min-h-[50px] border-2 border-dashed rounded flex items-center justify-center text-xs text-muted-foreground">
                                    Drag issues here (Not implemented yet)
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'reports' && (
                    <div className="h-full overflow-y-auto p-4">
                        <h2 className="text-2xl font-bold mb-6">Sprint Reports</h2>
                        <div className="grid grid-cols-1 gap-8">
                            <BurndownChart />

                            <div className="p-6 bg-card rounded-lg border shadow-sm">
                                <h3 className="text-lg font-bold mb-4">Velocity Chart</h3>
                                <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded">
                                    Your velocity is consistently disappointing.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

