import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoards, useCreateBoard } from '../hooks/useBoards';
import { Button } from '../components/ui/button';
import { Loader2, Plus, Layout, List } from 'lucide-react';

export const BoardListPage = () => {
    const navigate = useNavigate();
    const { data: boards, isLoading } = useBoards();
    const createBoard = useCreateBoard();
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateBoard = async () => {
        setIsCreating(true);
        try {
            await createBoard.mutateAsync({
                project_id: 1, // Default project
                name: `New Board ${new Date().toLocaleTimeString()}`,
                type: Math.random() > 0.5 ? 'scrum' : 'kanban'
            });
        } finally {
            setIsCreating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Boards</h1>
                <Button onClick={handleCreateBoard} disabled={isCreating} variant="enterprise">
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    Create Board
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {boards?.map((board) => (
                    <div
                        key={board.id}
                        className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/boards/${board.id}`)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-primary/10 rounded-md">
                                {board.type === 'scrum' ? <List className="h-6 w-6 text-primary" /> : <Layout className="h-6 w-6 text-primary" />}
                            </div>
                            <span className="text-xs font-bold uppercase bg-muted px-2 py-1 rounded text-muted-foreground">
                                {board.type}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{board.name}</h3>
                        <p className="text-sm text-muted-foreground">Project: HomeSprint</p>
                    </div>
                ))}

                {boards?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No boards found. Create one to start organizing your chaos.
                    </div>
                )}
            </div>
        </div>
    );
};
