import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../hooks/useUsers';
import { Button } from '../components/ui/button';
import { Loader2, Shield, UserPlus, CheckCircle } from 'lucide-react';

export const SetupPage = () => {
    const navigate = useNavigate();
    const createUser = useCreateUser();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        username: '',
        display_name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
        }

        if (!formData.display_name.trim()) {
            newErrors.display_name = 'Display name is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 4) {
            newErrors.password = 'Password must be at least 4 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
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

        try {
            // Create admin user
            const adminUser = await createUser.mutateAsync({
                username: formData.username,
                display_name: formData.display_name,
                email: formData.email || undefined,
                role: 'admin',
            });

            // Store password in localStorage (in production, this should be hashed and stored securely)
            const credentials = JSON.parse(localStorage.getItem('homesprint_credentials') || '{}');
            credentials[formData.username] = formData.password;
            localStorage.setItem('homesprint_credentials', JSON.stringify(credentials));

            // Store user session
            localStorage.setItem('homesprint_user', JSON.stringify({
                id: adminUser.id,
                username: adminUser.username,
                display_name: adminUser.display_name,
                role: adminUser.role,
            }));

            // Mark setup as complete
            localStorage.setItem('homesprint_setup_complete', 'true');

            // Redirect to dashboard
            navigate('/');
            window.location.reload(); // Reload to update auth context
        } catch (error: any) {
            if (error.message?.includes('unique')) {
                setErrors({ submit: 'Username already exists. Please choose another.' });
            } else {
                setErrors({ submit: 'Failed to create admin user. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Shield className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to HomeSprint!</h1>
                    <p className="text-muted-foreground mt-2">
                        Let's get started by creating your admin account
                    </p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-medium">Full Administrative Access</p>
                                <p className="text-muted-foreground text-xs">Manage users, projects, and all issues</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-medium">Create Additional Users</p>
                                <p className="text-muted-foreground text-xs">Add family members or team members later</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Username <span className="text-destructive">*</span>
                            </label>
                            <input
                                required
                                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                                    errors.username ? 'border-destructive' : 'border-input bg-background'
                                }`}
                                placeholder="admin"
                                value={formData.username}
                                onChange={e => {
                                    setFormData({ ...formData, username: e.target.value.toLowerCase() });
                                    if (errors.username) setErrors({ ...errors, username: '' });
                                }}
                            />
                            {errors.username && (
                                <p className="text-xs text-destructive">{errors.username}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Display Name <span className="text-destructive">*</span>
                            </label>
                            <input
                                required
                                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                                    errors.display_name ? 'border-destructive' : 'border-input bg-background'
                                }`}
                                placeholder="Administrator"
                                value={formData.display_name}
                                onChange={e => {
                                    setFormData({ ...formData, display_name: e.target.value });
                                    if (errors.display_name) setErrors({ ...errors, display_name: '' });
                                }}
                            />
                            {errors.display_name && (
                                <p className="text-xs text-destructive">{errors.display_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email (optional)</label>
                            <input
                                type="email"
                                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                                    errors.email ? 'border-destructive' : 'border-input bg-background'
                                }`}
                                placeholder="admin@example.com"
                                value={formData.email}
                                onChange={e => {
                                    setFormData({ ...formData, email: e.target.value });
                                    if (errors.email) setErrors({ ...errors, email: '' });
                                }}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Password <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="password"
                                required
                                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                                    errors.password ? 'border-destructive' : 'border-input bg-background'
                                }`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => {
                                    setFormData({ ...formData, password: e.target.value });
                                    if (errors.password) setErrors({ ...errors, password: '' });
                                }}
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive">{errors.password}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Confirm Password <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="password"
                                required
                                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                                    errors.confirmPassword ? 'border-destructive' : 'border-input bg-background'
                                }`}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={e => {
                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                }}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {errors.submit && (
                            <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                                <p className="text-sm text-destructive">{errors.submit}</p>
                            </div>
                        )}

                        <Button type="submit" variant="enterprise" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Admin Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Create Admin Account
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    This will be your main administrative account. You can create additional user accounts later.
                </p>
            </div>
        </div>
    );
};
