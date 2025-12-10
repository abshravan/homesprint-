import { useParams } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';
import { useIssues } from '../hooks/useIssues';
import { KanbanBoard } from '../components/boards/KanbanBoard';
import { ScrumBoard } from '../components/boards/ScrumBoard';
import { Loader2 } from 'lucide-react';

export const BoardDetailPage = () => {
    const { id } = useParams();
    const { data: boards, isLoading: isLoadingBoards } = useBoards();
    const { data: issues, isLoading: isLoadingIssues } = useIssues();

    const board = boards?.find(b => b.id === Number(id));

    if (isLoadingBoards || isLoadingIssues) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!board) {
        return <div>Board not found</div>;
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{board.name}</h1>
                <p className="text-muted-foreground capitalize">{board.type} Board</p>
            </div>

            <div className="flex-1 overflow-hidden">
                {board.type === 'kanban' ? (
                    <KanbanBoard issues={issues || []} />
                ) : (
                    <ScrumBoard boardId={board.id} />
                )}
            </div>
        </div>
    );
};
