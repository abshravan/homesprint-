import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateUser } from '../hooks/useUsers';
import { Button } from '../components/ui/button';
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react';

export const SignupPage = () => {
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
            // Create member user
            const newUser = await createUser.mutateAsync({
                username: formData.username,
                display_name: formData.display_name,
                email: formData.email || undefined,
                role: 'member',
            });

            // Store password in localStorage
            const credentials = JSON.parse(localStorage.getItem('homesprint_credentials') || '{}');
            credentials[formData.username] = formData.password;
            localStorage.setItem('homesprint_credentials', JSON.stringify(credentials));

            // Store user session
            localStorage.setItem('homesprint_user', JSON.stringify({
                id: newUser.id,
                username: newUser.username,
                display_name: newUser.display_name,
                role: newUser.role,
            }));

            // Redirect to dashboard
            navigate('/');
            window.location.reload();
        } catch (error: any) {
            if (error.message?.includes('unique')) {
                setErrors({ submit: 'Username already exists. Please choose another.' });
            } else {
                setErrors({ submit: 'Failed to create account. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                    <p className="text-muted-foreground mt-2">
                        Join HomeSprint to start managing your household tasks
                    </p>
                </div>

                <div className="bg-card p-6 rounded-lg border shadow-sm">
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
                                placeholder="johndoe"
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
                                placeholder="John Doe"
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
                                placeholder="john@example.com"
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
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Create Account
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};
