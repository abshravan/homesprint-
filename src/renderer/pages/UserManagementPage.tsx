import React, { useState } from 'react';
import { useUsers, useCreateUser } from '../hooks/useUsers';
import { Button } from '../components/ui/button';
import { Loader2, UserPlus, Users, Mail, Shield } from 'lucide-react';

export const UserManagementPage = () => {
    const { data: users, isLoading: usersLoading } = useUsers();
    const createUser = useCreateUser();
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        username: '',
        display_name: '',
        email: '',
        role: 'member' as 'admin' | 'member' | 'guest',
    });

    const resetForm = () => {
        setFormData({
            username: '',
            display_name: '',
            email: '',
            role: 'member',
        });
        setErrors({});
    };

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

        setIsSubmitting(true);

        try {
            await createUser.mutateAsync({
                ...formData,
                email: formData.email || undefined,
            });
            resetForm();
            setShowForm(false);
        } catch (error: any) {
            if (error.message?.includes('unique')) {
                setErrors({ submit: 'Username already exists. Try being more creative.' });
            } else {
                setErrors({ submit: 'Failed to create user. Please try again.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (usersLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        User Management
                    </h1>
                    <p className="text-muted-foreground">
                        Add more people to blame when things don't get done.
                    </p>
                </div>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} variant="enterprise">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                )}
            </div>

            {/* Add User Form */}
            {showForm && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Create New User</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Username <span className="text-destructive">*</span>
                                </label>
                                <input
                                    required
                                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
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
                                <label className="text-sm font-medium leading-none">
                                    Display Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    required
                                    className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="email"
                                        className={`flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                            errors.email ? 'border-destructive' : 'border-input bg-background'
                                        }`}
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={e => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (errors.email) setErrors({ ...errors, email: '' });
                                        }}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Role</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                                    >
                                        <option value="guest">Guest (Read-only)</option>
                                        <option value="member">Member (Can do tasks)</option>
                                        <option value="admin">Admin (Can blame others)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                                <p className="text-sm text-destructive">{errors.submit}</p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="enterprise" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding User...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Create User
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users List */}
            <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Current Users ({users?.length || 0})</h2>
                </div>
                <div className="divide-y">
                    {users?.map(user => (
                        <div key={user.id} className="p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                        user.role === 'admin' ? 'bg-purple-500' :
                                        user.role === 'member' ? 'bg-blue-500' :
                                        'bg-gray-400'
                                    }`}>
                                        {user.display_name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-semibold">{user.display_name}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'member' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                            <span>@{user.username}</span>
                                            {user.email && (
                                                <>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Joined {new Date(user.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
