import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Bell, HelpCircle, Search, User, LogOut, Settings, UserCircle, X, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIssues } from '../../hooks/useIssues';
import { cn } from '../../lib/utils';

export const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { data: issues } = useIssues();

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    // Dropdown states
    const [showNotifications, setShowNotifications] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() && issues) {
            const query = searchQuery.toLowerCase();
            const filtered = issues.filter(issue =>
                issue.summary.toLowerCase().includes(query) ||
                issue.issue_key.toLowerCase().includes(query) ||
                issue.description?.toLowerCase().includes(query)
            ).slice(0, 5); // Limit to 5 results
            setSearchResults(filtered);
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    }, [searchQuery, issues]);

    const handleSearchSelect = (issueId: number) => {
        navigate(`/issues/${issueId}`);
        setSearchQuery('');
        setShowSearchResults(false);
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/login');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowNotifications(false);
            setShowHelp(false);
            setShowUserMenu(false);
        };

        if (showNotifications || showHelp || showUserMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showNotifications, showHelp, showUserMenu]);

    return (
        <header className="h-14 border-b bg-card flex items-center px-4 justify-between sticky top-0 z-50">
            <div className="flex items-center w-1/3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Search issues, projects, or excuses..."
                        className="w-full h-9 pl-8 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery && setShowSearchResults(true)}
                    />

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full mt-1 w-full bg-card border rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
                            {searchResults.map(issue => (
                                <button
                                    key={issue.id}
                                    onClick={() => handleSearchSelect(issue.id)}
                                    className="w-full text-left p-3 hover:bg-muted border-b last:border-b-0 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-muted-foreground">{issue.issue_key}</span>
                                        <span className={cn(
                                            "text-xs px-1.5 py-0.5 rounded uppercase font-bold",
                                            issue.status === 'done' ? 'bg-green-100 text-green-800' :
                                            issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        )}>
                                            {issue.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium mt-1">{issue.summary}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {showSearchResults && searchResults.length === 0 && searchQuery && (
                        <div className="absolute top-full mt-1 w-full bg-card border rounded-md shadow-lg p-4 z-50">
                            <p className="text-sm text-muted-foreground">No issues found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                {/* Notifications */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowNotifications(!showNotifications);
                            setShowHelp(false);
                            setShowUserMenu(false);
                        }}
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full" />
                    </Button>

                    {showNotifications && (
                        <div
                            className="absolute right-0 mt-2 w-80 bg-card border rounded-md shadow-lg z-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-3 border-b flex items-center justify-between">
                                <h3 className="font-semibold">Notifications</h3>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                <div className="p-4 border-b hover:bg-muted cursor-pointer">
                                    <div className="flex items-start gap-3">
                                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Welcome to HomeSprint!</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Start tracking your household tasks and avoid spousal disappointment.
                                            </p>
                                            <span className="text-xs text-muted-foreground">Just now</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    No more notifications. You're all caught up! (Surprisingly)
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Help */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowHelp(!showHelp);
                            setShowNotifications(false);
                            setShowUserMenu(false);
                        }}
                    >
                        <HelpCircle className="h-5 w-5" />
                    </Button>

                    {showHelp && (
                        <div
                            className="absolute right-0 mt-2 w-64 bg-card border rounded-md shadow-lg z-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-3 border-b">
                                <h3 className="font-semibold">Help & Resources</h3>
                            </div>
                            <div className="p-2">
                                <button className="w-full text-left p-2 hover:bg-muted rounded flex items-center gap-2 text-sm">
                                    <ExternalLink className="h-4 w-4" />
                                    Getting Started Guide
                                </button>
                                <button className="w-full text-left p-2 hover:bg-muted rounded flex items-center gap-2 text-sm">
                                    <ExternalLink className="h-4 w-4" />
                                    Keyboard Shortcuts
                                </button>
                                <button className="w-full text-left p-2 hover:bg-muted rounded flex items-center gap-2 text-sm">
                                    <ExternalLink className="h-4 w-4" />
                                    Submit Feedback
                                </button>
                                <div className="border-t my-2" />
                                <div className="p-2 text-xs text-muted-foreground">
                                    Version 1.0.0
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowUserMenu(!showUserMenu);
                            setShowNotifications(false);
                            setShowHelp(false);
                        }}
                    >
                        <User className="h-5 w-5" />
                    </Button>

                    {showUserMenu && (
                        <div
                            className="absolute right-0 mt-2 w-64 bg-card border rounded-md shadow-lg z-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-3 border-b">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-sm font-bold text-primary">
                                        {user?.display_name?.slice(0, 2).toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{user?.display_name || 'User'}</p>
                                        <p className="text-xs text-muted-foreground">{user?.role || 'member'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2">
                                <Link
                                    to="/settings"
                                    className="w-full text-left p-2 hover:bg-muted rounded flex items-center gap-2 text-sm"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <UserCircle className="h-4 w-4" />
                                    Profile
                                </Link>
                                <Link
                                    to="/settings"
                                    className="w-full text-left p-2 hover:bg-muted rounded flex items-center gap-2 text-sm"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                                <div className="border-t my-2" />
                                <button
                                    className="w-full text-left p-2 hover:bg-muted rounded flex items-center gap-2 text-sm text-destructive"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <Link to="/issues/create">
                    <Button variant="enterprise" size="sm">
                        Create Issue
                    </Button>
                </Link>
            </div>
        </header>
    );
};
