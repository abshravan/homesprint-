import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    CheckSquare,
    ListTodo,
    Settings,
    Coffee,
    ChevronRight,
    ChevronDown,
    LogOut,
    User,
} from 'lucide-react';

interface NavItem {
    title: string;
    href?: string;
    icon?: React.ElementType;
    children?: NavItem[];
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
        icon: Coffee,
        children: [
            { title: 'Sprints', href: '/sprints' },
            { title: 'Backlog', href: '/backlog' },
            { title: 'Releases', href: '/releases' },
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
                        "flex items-center px-4 py-2 text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors",
                        isActive && "bg-accent text-accent-foreground",
                        depth > 0 && "pl-8"
                    )}
                >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    <span className="truncate">{item.title}</span>
                </div>
            </Link>
        );
    }

    // Parent node with children
    return (
        <div className="w-full">
            <div
                className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors",
                    depth > 0 && "pl-8"
                )}
                onClick={toggleOpen}
            >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <div className="flex items-center justify-between w-full">
                    <span className="truncate">{item.title}</span>
                    {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </div>
            </div>
            {isOpen && (
                <div className="bg-muted/30">
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
        <div className="w-64 border-r bg-card h-screen flex flex-col">
            <div className="p-4 border-b flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">HS</span>
                </div>
                <span className="font-bold text-lg tracking-tight">HomeSprint</span>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1">
                    {navItems.map((item, index) => (
                        <NavItemComponent key={index} item={item} />
                    ))}
                </nav>
            </div>
            <div className="border-t">
                <div className="p-3 flex items-center space-x-2 text-sm">
                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user?.display_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center space-x-2"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </button>
                <div className="p-2 text-xs text-muted-foreground text-center">
                    v1.0.0 (Enterprise Edition)
                </div>
            </div>
        </div>
    );
};
