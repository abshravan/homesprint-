import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

export const PlaceholderPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
            <div className="bg-muted/30 p-6 rounded-full">
                <Construction className="h-16 w-16 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Feature De-scoped</h1>
            <p className="text-muted-foreground max-w-md text-lg">
                This feature was originally in the roadmap, but due to "budget cuts" (laziness) and "strategic realignment" (naps), it has been moved to the backlog for Q4 2035.
            </p>
            <div className="pt-4">
                <Button onClick={() => navigate(-1)} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back to Safety
                </Button>
            </div>
        </div>
    );
};
