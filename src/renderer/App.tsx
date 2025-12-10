import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MainLayout } from './components/layout/MainLayout';
import { IssueListPage } from './pages/IssueListPage';
import { CreateIssuePage } from './pages/CreateIssuePage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { BoardListPage } from './pages/BoardListPage';
import { BoardDetailPage } from './pages/BoardDetailPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { useDashboardStats } from './hooks/useDashboard';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

const Dashboard = () => {
    const { data: stats, isLoading, error } = useDashboardStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-destructive">Failed to load dashboard</h2>
                    <p className="text-sm text-muted-foreground mt-2">Please try refreshing the application</p>
                </div>
            </div>
        );
    }

    const completionRate = stats?.totalIssues ? Math.round((stats.completedIssues / stats.totalIssues) * 100) : 0;
    const overduePercentage = stats?.totalIssues ? Math.round((stats.overdueIssues / stats.totalIssues) * 100) : 0;

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">System Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Issues</h3>
                    <div className="text-2xl font-bold">{stats?.totalIssues || 0}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats?.totalIssues === 0 ? 'No issues yet!' : `${completionRate}% completed`}
                    </p>
                </div>
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Overdue</h3>
                    <div className="text-2xl font-bold text-destructive">{stats?.overdueIssues || 0}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats?.overdueIssues === 0 ? 'All caught up!' : overduePercentage > 50 ? 'You should be worried' : 'Getting behind'}
                    </p>
                </div>
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
                    <div className="text-2xl font-bold">{stats?.inProgressIssues || 0}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats?.inProgressIssues === 0 ? 'Nothing started yet' : 'Currently active'}
                    </p>
                </div>
                <div className="p-6 bg-card rounded-lg border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                    <div className="text-2xl font-bold text-green-600">{stats?.completedIssues || 0}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats?.completedIssues === 0 ? 'Better get started!' : 'Tasks finished'}
                    </p>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Routes>
                        <Route element={<MainLayout />}>
                        {/* Dashboards */}
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard/exec" element={<PlaceholderPage />} />
                        <Route path="/dashboard/shame" element={<PlaceholderPage />} />

                        {/* Projects */}
                        <Route path="/projects" element={<BoardListPage />} /> {/* Reuse BoardList for Projects */}
                        <Route path="/projects/create" element={<BoardListPage />} /> {/* Just go to list for now */}
                        <Route path="/projects/archived" element={<PlaceholderPage />} />

                        {/* Issues */}
                        <Route path="/issues" element={<IssueListPage />} />
                        <Route path="/issues/create" element={<CreateIssuePage />} />
                        <Route path="/issues/my-open" element={<IssueListPage />} /> {/* Reuse IssueList */}
                        <Route path="/issues/reported" element={<IssueListPage />} /> {/* Reuse IssueList */}
                        <Route path="/issues/old" element={<IssueListPage />} /> {/* Reuse IssueList */}
                        <Route path="/issues/:id" element={<IssueDetailPage />} />

                        {/* Operations */}
                        <Route path="/sprints" element={<BoardListPage />} /> {/* Sprints live in Boards */}
                        <Route path="/backlog" element={<BoardListPage />} /> {/* Backlogs live in Boards */}
                        <Route path="/releases" element={<PlaceholderPage />} />

                        {/* System */}
                        <Route path="/settings/users" element={<PlaceholderPage />} />
                        <Route path="/settings/config" element={<PlaceholderPage />} />
                        <Route path="/settings/excuses" element={<PlaceholderPage />} />

                        {/* Boards (Core) */}
                        <Route path="/boards" element={<BoardListPage />} />
                        <Route path="/boards/:id" element={<BoardDetailPage />} />

                        {/* Catch-all */}
                        <Route path="*" element={<PlaceholderPage />} />
                    </Route>
                </Routes>
            </Router>
        </QueryClientProvider>
        </ErrorBoundary>
    );
}

export default App;
