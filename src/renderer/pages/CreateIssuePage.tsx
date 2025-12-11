import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateIssue } from '../hooks/useIssues';
import { useUsers } from '../hooks/useUsers';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

export const CreateIssuePage = () => {
    const navigate = useNavigate();
    const createIssue = useCreateIssue();
    const { data: users } = useUsers();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        summary: '',
        description: '',
        project_id: 1, // Default to first project for now
        issue_type_id: 2, // Default to Story
        priority: 'medium',
        procrastination_level: 'low',
        spouse_approval_required: false,
        story_points: 1,
        assignee_id: undefined as number | undefined,
        due_date: '',
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.summary.trim()) {
            newErrors.summary = 'Summary is required';
        } else if (formData.summary.length > 255) {
            newErrors.summary = 'Summary must be 255 characters or less';
        }

        if (formData.description && formData.description.length > 5000) {
            newErrors.description = 'Description must be 5000 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        // Simulate enterprise latency
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            // Prepare data, only include due_date if it's set
            const issueData: any = {
                ...formData,
                reporter_id: 1, // Default user
            };

            // Only include due_date if it's not empty
            if (formData.due_date) {
                issueData.due_date = formData.due_date;
            }

            await createIssue.mutateAsync(issueData);
            navigate('/issues');
        } catch (error) {
            setErrors({ submit: 'Failed to create issue. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = formData.summary.trim() && formData.summary.length <= 255;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Create Issue</h1>
                <p className="text-muted-foreground">Add another item to the pile of things you won't do.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Summary <span className="text-destructive">*</span>
                    </label>
                    <input
                        required
                        maxLength={255}
                        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.summary ? 'border-destructive' : 'border-input bg-background'
                        }`}
                        placeholder="e.g., Fix the leaky faucet"
                        value={formData.summary}
                        onChange={e => {
                            setFormData({ ...formData, summary: e.target.value });
                            if (errors.summary) setErrors({ ...errors, summary: '' });
                        }}
                    />
                    {errors.summary ? (
                        <p className="text-xs text-destructive">{errors.summary}</p>
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            {formData.summary.length}/255 characters. Keep it short, you'll ignore it anyway.
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Description</label>
                    <textarea
                        maxLength={5000}
                        className={`flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                            errors.description ? 'border-destructive' : 'border-input bg-background'
                        }`}
                        placeholder="Detailed excuses go here..."
                        value={formData.description}
                        onChange={e => {
                            setFormData({ ...formData, description: e.target.value });
                            if (errors.description) setErrors({ ...errors, description: '' });
                        }}
                    />
                    {errors.description ? (
                        <p className="text-xs text-destructive">{errors.description}</p>
                    ) : (
                        <p className="text-xs text-muted-foreground">{formData.description.length}/5000 characters</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Priority</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.priority}
                            onChange={e => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option value="trivial">Trivial (Ignore)</option>
                            <option value="minor">Minor (Later)</option>
                            <option value="medium">Medium (Maybe)</option>
                            <option value="major">Major (Nagging)</option>
                            <option value="critical">Critical (Spouse Mad)</option>
                            <option value="blocker">Blocker (No Internet)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Procrastination Level</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.procrastination_level}
                            onChange={e => setFormData({ ...formData, procrastination_level: e.target.value })}
                        >
                            <option value="low">Low (I might do this)</option>
                            <option value="medium">Medium (Next weekend)</option>
                            <option value="high">High (Next month)</option>
                            <option value="extreme">Extreme (Next year)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Assignee</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.assignee_id || ''}
                            onChange={e => setFormData({ ...formData, assignee_id: e.target.value ? Number(e.target.value) : undefined })}
                        >
                            <option value="">Unassigned (Safe choice)</option>
                            {users?.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.display_name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-muted-foreground">
                            Assign to someone who will blame later
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Due Date</label>
                        <input
                            type="date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.due_date}
                            onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                            Pick a date you'll definitely miss
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="spouse_approval"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={formData.spouse_approval_required}
                        onChange={e => setFormData({ ...formData, spouse_approval_required: e.target.checked })}
                    />
                    <label htmlFor="spouse_approval" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Requires Spouse Approval (Risk of rejection)
                    </label>
                </div>

                {errors.submit && (
                    <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                        <p className="text-sm text-destructive">{errors.submit}</p>
                    </div>
                )}

                <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="ghost" onClick={() => navigate('/issues')} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="enterprise" disabled={isLoading || !isFormValid}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing Bureaucracy...
                            </>
                        ) : (
                            'Add to Pile of Shame'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};
