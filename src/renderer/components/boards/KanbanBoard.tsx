import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Issue } from '../../../shared/types/issue.types';
import { BoardColumn } from './BoardColumn';
import { IssueCard } from './IssueCard';
import { useUpdateIssueStatus } from '../../hooks/useIssues';
import { createPortal } from 'react-dom';

interface KanbanBoardProps {
    issues: Issue[];
}

const COLUMNS = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
];

export const KanbanBoard = ({ issues }: KanbanBoardProps) => {
    const updateStatus = useUpdateIssueStatus();
    const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.issue) {
            setActiveIssue(event.active.data.current.issue as Issue);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveIssue(null);

        if (!over) return;

        const issueId = Number(active.id);
        const newStatus = over.id as string;
        const currentStatus = active.data.current?.issue?.status;

        if (currentStatus !== newStatus) {
            updateStatus.mutate({ id: issueId, status: newStatus });
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full space-x-4 overflow-x-auto pb-4">
                {COLUMNS.map((col) => (
                    <BoardColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        issues={issues.filter(i => i.status === col.id)}
                    />
                ))}
            </div>

            {createPortal(
                <DragOverlay>
                    {activeIssue ? <IssueCard issue={activeIssue} /> : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
};
