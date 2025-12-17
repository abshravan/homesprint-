import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DatabaseInitializer } from './components/DatabaseInitializer';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { SetupPage } from './pages/SetupPage';
import { MainLayout } from './components/layout/MainLayout';
import { IssueListPage } from './pages/IssueListPage';
import { CreateIssuePage } from './pages/CreateIssuePage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { BoardListPage } from './pages/BoardListPage';
import { BoardDetailPage } from './pages/BoardDetailPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { WallOfShameDashboard } from './pages/WallOfShameDashboard';
import { MyOpenIssuesPage } from './pages/MyOpenIssuesPage';
import { ReportedIssuesPage } from './pages/ReportedIssuesPage';
import { OldIssuesPage } from './pages/OldIssuesPage';
import { ProjectListPage } from './pages/ProjectListPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ArchivedProjectsPage } from './pages/ArchivedProjectsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { TaskHistoryPage } from './pages/TaskHistoryPage';
import { SprintArchivePage } from './pages/SprintArchivePage';
import { SettingsPage } from './pages/SettingsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { useDashboardStats } from './hooks/useDashboard';
import { getUserService } from '../services/user.service';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

const FirstRunCheck = ({ children }: { children: React.ReactNode }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [needsSetup, setNeedsSetup] = useState(false);
    const userService = getUserService();

    useEffect(() => {
        const checkFirstRun = async () => {
            try {
                // Check if setup is complete
                const setupComplete = localStorage.getItem('homesprint_setup_complete');
                if (setupComplete === 'true') {
                    setNeedsSetup(false);
                } else {
                    // Check if any users exist
                    const users = await userService.getAll();
                    setNeedsSetup(users.length === 0);
                }
            } catch (error) {
                console.error('Error checking first run:', error);
                setNeedsSetup(false);
            } finally {
                setIsChecking(false);
            }
        };

        checkFirstRun();
    }, []);

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Initializing...</p>
                </div>
            </div>
        );
    }

    if (needsSetup) {
        return <Navigate to="/setup" replace />;
    }

    return <>{children}</>;
};

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
            <AuthProvider>
                <DatabaseInitializer>
                    <QueryClientProvider client={queryClient}>
                        <Router>
                            <Routes>
                                <Route path="/setup" element={<SetupPage />} />
                                <Route path="/login" element={<FirstRunCheck><LoginPage /></FirstRunCheck>} />
                                <Route path="/signup" element={<FirstRunCheck><SignupPage /></FirstRunCheck>} />
                                <Route element={<FirstRunCheck><ProtectedRoute><MainLayout /></ProtectedRoute></FirstRunCheck>}>
                                    {/* Dashboards */}
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/dashboard/exec" element={<ExecutiveDashboard />} />
                                    <Route path="/dashboard/shame" element={<WallOfShameDashboard />} />
                                    <Route path="/achievements" element={<AchievementsPage />} />

                                    {/* Projects */}
                                    <Route path="/projects" element={<ProjectListPage />} />
                                    <Route path="/projects/create" element={<CreateProjectPage />} />
                                    <Route path="/projects/archived" element={<ArchivedProjectsPage />} />

                                    {/* Issues */}
                                    <Route path="/issues" element={<IssueListPage />} />
                                    <Route path="/issues/create" element={<CreateIssuePage />} />
                                    <Route path="/issues/my-open" element={<MyOpenIssuesPage />} />
                                    <Route path="/issues/reported" element={<ReportedIssuesPage />} />
                                    <Route path="/issues/old" element={<OldIssuesPage />} />
                                    <Route path="/issues/:id" element={<IssueDetailPage />} />

                                    {/* Operations */}
                                    <Route path="/sprints" element={<BoardListPage />} />
                                    <Route path="/backlog" element={<BoardListPage />} />
                                    <Route path="/operations/history" element={<TaskHistoryPage />} />
                                    <Route path="/operations/archive" element={<SprintArchivePage />} />
                                    <Route path="/releases" element={<PlaceholderPage />} />

                                    {/* System */}
                                    <Route path="/settings/users" element={<UserManagementPage />} />
                                    <Route path="/settings/config" element={<SettingsPage />} />
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
                </DatabaseInitializer>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
