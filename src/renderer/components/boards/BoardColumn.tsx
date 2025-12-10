import { useDroppable } from '@dnd-kit/core';
import { Issue } from '../../../shared/types/issue.types';
import { IssueCard } from './IssueCard';
import { cn } from '../../lib/utils';

interface BoardColumnProps {
    id: string;
    title: string;
    issues: Issue[];
}

export const BoardColumn = ({ id, title, issues }: BoardColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col h-full min-w-[280px] w-[280px] bg-muted/30 rounded-lg border">
            <div className="p-3 border-b bg-muted/50 rounded-t-lg flex items-center justify-between">
                <h3 className="font-semibold text-sm uppercase tracking-wider">{title}</h3>
                <span className="text-xs font-mono bg-background px-2 py-0.5 rounded-full border">
                    {issues.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 p-2 space-y-2 overflow-y-auto min-h-[150px]",
                    isOver && "bg-primary/5"
                )}
            >
                {issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                ))}

                {issues.length === 0 && (
                    <div className="h-24 border-2 border-dashed rounded-md flex items-center justify-center text-xs text-muted-foreground">
                        Drop items here
                    </div>
                )}
            </div>
        </div>
    );
};
