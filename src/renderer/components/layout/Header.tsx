import { Button } from '../ui/button';
import { Bell, HelpCircle, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
    return (
        <header className="h-14 border-b bg-card flex items-center px-4 justify-between">
            <div className="flex items-center w-1/3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder="Search issues, projects, or excuses..."
                        className="w-full h-9 pl-8 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full" />
                </Button>
                <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                </Button>
                <Link to="/issues/create">
                    <Button variant="enterprise" size="sm">
                        Create Issue
                    </Button>
                </Link>
            </div>
        </header>
    );
};
