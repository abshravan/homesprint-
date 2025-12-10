import { useEffect, useState } from 'react';
import { getDatabase } from '../../lib/database';
import { Loader2 } from 'lucide-react';

interface DatabaseInitializerProps {
    children: React.ReactNode;
}

export const DatabaseInitializer: React.FC<DatabaseInitializerProps> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initDatabase = async () => {
            try {
                const db = getDatabase();
                await db.init();
                setIsInitialized(true);
            } catch (err) {
                console.error('Failed to initialize database:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };

        initDatabase();
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md">
                    <div className="text-destructive mb-4">
                        <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Database Initialization Failed</h2>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Reload Application
                    </button>
                </div>
            </div>
        );
    }

    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Initializing Database</p>
                    <p className="text-sm text-muted-foreground">Setting up your workspace...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
