import { useState } from 'react';
import { Button } from '../ui/button';
import { generateExcuse } from '../../lib/excuses';
import { Copy, RefreshCw, ShieldAlert } from 'lucide-react';
import { useCreateComment } from '../../hooks/useComments';

interface ExcuseGeneratorProps {
    issueId: number;
}

export const ExcuseGenerator = ({ issueId }: ExcuseGeneratorProps) => {
    const [excuse, setExcuse] = useState<string>('');
    const createComment = useCreateComment();

    const handleGenerate = () => {
        setExcuse(generateExcuse());
    };

    const handleAddToComments = () => {
        if (excuse) {
            createComment.mutate({
                issue_id: issueId,
                content: `[EXCUSE GENERATED]: ${excuse}`,
                author_id: 1 // Current user
            });
            setExcuse('');
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
            <div className="flex items-center space-x-2 text-amber-600">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-semibold">Professional Excuse Generator</h3>
            </div>
            <p className="text-sm text-muted-foreground">
                Stuck? Blocked? Just lazy? Generate a corporate-approved excuse to update your stakeholders.
            </p>

            {excuse && (
                <div className="p-3 bg-background border rounded-md text-sm font-medium italic">
                    "{excuse}"
                </div>
            )}

            <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleGenerate}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Excuse
                </Button>
                {excuse && (
                    <Button size="sm" variant="secondary" onClick={handleAddToComments}>
                        <Copy className="h-4 w-4 mr-2" />
                        Add to Comments
                    </Button>
                )}
            </div>
        </div>
    );
};
