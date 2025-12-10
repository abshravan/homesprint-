import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export const CreateProjectPage = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        key: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/projects');
        }, 1000);
    };

    const generateKey = (name: string) => {
        return name
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .slice(0, 10);
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            key: generateKey(name) || formData.key,
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <Button
                    variant="ghost"
                    onClick={() => navigate('/projects')}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Projects
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
                <p className="text-muted-foreground mt-2">
                    Start a new adventure in procrastination and unrealistic goals.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                        Project Name <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g., Home Renovation 2025"
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        Choose a name that sounds ambitious and will haunt you later.
                    </p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="key" className="text-sm font-medium">
                        Project Key <span className="text-destructive">*</span>
                    </label>
                    <input
                        id="key"
                        type="text"
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value.toUpperCase() })}
                        placeholder="e.g., HOME2025"
                        maxLength={10}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        A unique identifier for your project (max 10 characters, uppercase).
                    </p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your project... or just write something that sounds productive."
                        rows={4}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                        Optional. Future you will appreciate this context.
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting || !formData.name || !formData.key}
                        variant="enterprise"
                        className="flex-1"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Project'
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/projects')}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </div>
            </form>

            <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">💡 Pro Tip</p>
                <p className="text-muted-foreground">
                    Projects in HomeSprint help organize your household tasks. Once created, you can add
                    boards, issues, and sprints to track everything you'll eventually get around to doing.
                </p>
            </div>
        </div>
    );
};
