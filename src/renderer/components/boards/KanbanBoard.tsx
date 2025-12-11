import { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { Issue } from '../../../shared/types/issue.types';
import { BoardColumn } from './BoardColumn';
import { IssueCard } from './IssueCard';
import { useUpdateIssueStatus } from '../../hooks/useIssues';
import { useUsers } from '../../hooks/useUsers';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KanbanBoardProps {
    issues: Issue[];
}

const COLUMNS = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
];

const PRIORITIES = ['blocker', 'critical', 'major', 'medium', 'minor', 'trivial'];

export const KanbanBoard = ({ issues }: KanbanBoardProps) => {
    const updateStatus = useUpdateIssueStatus();
    const { data: users } = useUsers();
    const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAssignee, setSelectedAssignee] = useState<number | 'all'>('all');
    const [selectedPriority, setSelectedPriority] = useState<string | 'all'>('all');
    const [showOverdueOnly, setShowOverdueOnly] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Filter issues
    const filteredIssues = useMemo(() => {
        return issues.filter(issue => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSummary = issue.summary.toLowerCase().includes(query);
                const matchesKey = issue.issue_key.toLowerCase().includes(query);
                if (!matchesSummary && !matchesKey) return false;
            }

            // Assignee filter
            if (selectedAssignee !== 'all') {
                if (issue.assignee_id !== selectedAssignee) return false;
            }

            // Priority filter
            if (selectedPriority !== 'all') {
                if (issue.priority !== selectedPriority) return false;
            }

            // Overdue filter
            if (showOverdueOnly) {
                if (!issue.due_date || issue.status === 'done') return false;
                if (new Date(issue.due_date) >= new Date()) return false;
            }

            return true;
        });
    }, [issues, searchQuery, selectedAssignee, selectedPriority, showOverdueOnly]);

    // Count active filters
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchQuery) count++;
        if (selectedAssignee !== 'all') count++;
        if (selectedPriority !== 'all') count++;
        if (showOverdueOnly) count++;
        return count;
    }, [searchQuery, selectedAssignee, selectedPriority, showOverdueOnly]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedAssignee('all');
        setSelectedPriority('all');
        setShowOverdueOnly(false);
    };

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
        <div className="flex flex-col h-full space-y-3">
            {/* Filter Bar */}
            <div className="space-y-2">
                {/* Search and Filter Toggle */}
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search issues by summary or key..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Button
                        variant={showFilters ? "enterprise" : "outline"}
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="relative"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown className={cn(
                            "h-4 w-4 ml-1 transition-transform",
                            showFilters && "rotate-180"
                        )} />
                    </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-md border">
                        {/* Assignee Filter */}
                        <div className="flex-1">
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Assignee
                            </label>
                            <select
                                value={selectedAssignee}
                                onChange={(e) => setSelectedAssignee(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="w-full px-2 py-1.5 text-sm border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">All Users</option>
                                {users?.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.display_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Priority Filter */}
                        <div className="flex-1">
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Priority
                            </label>
                            <select
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value)}
                                className="w-full px-2 py-1.5 text-sm border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">All Priorities</option>
                                {PRIORITIES.map(priority => (
                                    <option key={priority} value={priority}>
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Overdue Toggle */}
                        <div className="flex-1">
                            <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                Status
                            </label>
                            <button
                                onClick={() => setShowOverdueOnly(!showOverdueOnly)}
                                className={cn(
                                    "w-full px-3 py-1.5 text-sm border rounded transition-colors",
                                    showOverdueOnly
                                        ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800"
                                        : "bg-background hover:bg-muted"
                                )}
                            >
                                {showOverdueOnly ? 'Overdue Only' : 'All Statuses'}
                            </button>
                        </div>

                        {/* Clear Filters */}
                        {activeFilterCount > 0 && (
                            <div className="flex-shrink-0 self-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="h-8"
                                >
                                    <X className="h-3 w-3 mr-1" />
                                    Clear
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Results Count */}
                {(activeFilterCount > 0 || searchQuery) && (
                    <div className="text-xs text-muted-foreground">
                        Showing {filteredIssues.length} of {issues.length} issues
                        {activeFilterCount > 0 && ` (${activeFilterCount} ${activeFilterCount === 1 ? 'filter' : 'filters'} active)`}
                    </div>
                )}
            </div>

            {/* Kanban Board */}
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-1 space-x-4 overflow-x-auto pb-4">
                    {COLUMNS.map((col) => (
                        <BoardColumn
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            issues={filteredIssues.filter(i => i.status === col.id)}
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
        </div>
    );
};
