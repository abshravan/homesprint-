import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    CheckSquare,
    ListTodo,
    Settings,
    Zap,
    ChevronRight,
    LogOut,
    Archive,
    History,
    Rocket,
    Clock,
} from 'lucide-react';

interface NavItem {
    title: string;
    href?: string;
    icon?: React.ElementType;
    children?: NavItem[];
    badge?: string;
}

const navItems: NavItem[] = [
    {
        title: 'Dashboards',
        icon: LayoutDashboard,
        children: [
            { title: 'My Dashboard', href: '/' },
            { title: 'Executive Overview (Fake)', href: '/dashboard/exec' },
            { title: 'Wall of Shame', href: '/dashboard/shame' },
        ]
    },
    {
        title: 'Projects',
        icon: ListTodo,
        children: [
            { title: 'View All Projects', href: '/projects' },
            { title: 'Create Project', href: '/projects/create' },
            { title: 'Archived Dreams', href: '/projects/archived' },
        ]
    },
    {
        title: 'Issues',
        icon: CheckSquare,
        children: [
            { title: 'Search Issues', href: '/issues' },
            { title: 'Create Issue', href: '/issues/create' },
            { title: 'My Open Issues', href: '/issues/my-open' },
            { title: 'Reported by Me', href: '/issues/reported' },
            { title: 'Open Since 2023', href: '/issues/old' },
        ]
    },
    {
        title: 'Operations',
        icon: Zap,
        children: [
            { title: 'Active Sprints', href: '/sprints', icon: Rocket },
            { title: 'Backlog', href: '/backlog', icon: ListTodo },
            { title: 'Task History', href: '/operations/history', icon: History, badge: 'New' },
            { title: 'Sprint Archive', href: '/operations/archive', icon: Archive, badge: 'New' },
            { title: 'Releases', href: '/releases', icon: Clock },
        ]
    },
    {
        title: 'System',
        icon: Settings,
        children: [
            { title: 'User Management', href: '/settings/users' },
            { title: 'Global Config', href: '/settings/config' },
            { title: 'Excuse Templates', href: '/settings/excuses' },
        ]
    },
];

const NavItemComponent = ({ item, depth = 0 }: { item: NavItem; depth?: number }) => {
    // Open Dashboards by default
    const [isOpen, setIsOpen] = useState(depth === 0 && item.title === 'Dashboards');
    const location = useLocation();
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.href === location.pathname;

    const toggleOpen = () => setIsOpen(!isOpen);

    // If it's a leaf node (no children), render as Link
    if (!hasChildren && item.href) {
        return (
            <Link to={item.href} className="w-full block">
                <div
                    className={cn(
                        "flex items-center px-4 py-2.5 text-sm font-medium cursor-pointer transition-all relative group",
                        isActive
                            ? "bg-gradient-teal text-primary-foreground shadow-lg shadow-primary/20"
                            : "hover:bg-accent/50 hover:text-accent-foreground",
                        depth > 0 && "pl-8"
                    )}
                >
                    {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                    )}
                    {item.icon && <item.icon className="mr-3 h-4 w-4" />}
                    <span className="truncate flex-1">{item.title}</span>
                    {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary rounded-full">
                            {item.badge}
                        </span>
                    )}
                </div>
            </Link>
        );
    }

    // Parent node with children
    return (
        <div className="w-full">
            <div
                className={cn(
                    "flex items-center px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-accent/30 transition-colors",
                    depth > 0 && "pl-8"
                )}
                onClick={toggleOpen}
            >
                {item.icon && <item.icon className="mr-3 h-4 w-4 text-primary" />}
                <div className="flex items-center justify-between w-full">
                    <span className="truncate">{item.title}</span>
                    <div className={cn(
                        "transition-transform duration-200",
                        isOpen && "rotate-90"
                    )}>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="bg-muted/20 border-l border-primary/20 ml-4">
                    {item.children!.map((child, index) => (
                        <NavItemComponent key={index} item={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 border-r border-border/50 bg-card h-screen flex flex-col shadow-xl">
            {/* Logo/Brand */}
            <div className="p-4 border-b border-border/50 flex items-center space-x-3 bg-gradient-teal-dark">
                <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-bold text-lg">HS</span>
                </div>
                <div>
                    <span className="font-bold text-lg tracking-tight text-white">HomeSprint</span>
                    <div className="text-[10px] text-teal-100 uppercase tracking-widest">Enterprise</div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-0.5">
                    {navItems.map((item, index) => (
                        <NavItemComponent key={index} item={item} />
                    ))}
                </nav>
            </div>

            {/* User Section */}
            <div className="border-t border-border/50 bg-muted/30">
                <div className="p-3 flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-teal rounded-full flex items-center justify-center shadow-md">
                        <span className="text-primary-foreground font-bold text-sm">
                            {user?.display_name?.slice(0, 2).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user?.display_name}</p>
                        <p className="text-xs text-primary font-medium uppercase tracking-wide">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-sm text-left hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center space-x-3 font-medium"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </button>
                <div className="p-3 text-xs text-muted-foreground text-center border-t border-border/30">
                    <span className="text-primary font-mono">v1.0.0</span> • Enterprise Edition
                </div>
            </div>
        </div>
    );
};
