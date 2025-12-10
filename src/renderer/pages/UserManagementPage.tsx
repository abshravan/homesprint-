import { useState } from 'react';
import { useUsers, useCreateUser, useDeleteUser } from '../hooks/useUsers';
import { Button } from '../components/ui/button';
import { Loader2, Plus, User as UserIcon, Trash2, Shield, Users } from 'lucide-react';

export const UserManagementPage = () => {
    const { data: users, isLoading } = useUsers();
    const createUser = useCreateUser();
    const deleteUser = useDeleteUser();
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        display_name: '',
        email: '',
        role: 'member' as 'admin' | 'member' | 'guest',
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await createUser.mutateAsync({
                username: formData.username,
                display_name: formData.display_name,
                email: formData.email || undefined,
                role: formData.role,
            });
            setFormData({ username: '', display_name: '', email: '', role: 'member' });
            setShowAddForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create user');
        }
    };

    const handleDelete = async (id: number, username: string) => {
        if (username === 'admin') {
            setError('Cannot delete the admin user');
            return;
        }

        if (confirm(`Are you sure you want to delete ${username}?`)) {
            try {
                await deleteUser.mutateAsync(id);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete user');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading users...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Users className="h-8 w-8" />
                        User Management
                    </h1>
                    <p className="text-muted-foreground">Manage household members and their access</p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)} variant="enterprise">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </div>

            {error && (
                <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            {showAddForm && (
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Add New User</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Username <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="e.g., john"
                                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Display Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    placeholder="e.g., John Doe"
                                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="e.g., john@example.com"
                                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                    className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                    <option value="guest">Guest</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit" variant="enterprise" disabled={createUser.isPending}>
                                {createUser.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                Add User
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-card rounded-lg border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                <UserIcon className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium">{user.display_name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {user.email || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'member' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(user.id, user.username)}
                                            disabled={user.username === 'admin'}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">👥 About User Roles</p>
                <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                    <li><strong>Admin:</strong> Full access to all features and settings</li>
                    <li><strong>Member:</strong> Can create and manage their own issues and projects</li>
                    <li><strong>Guest:</strong> View-only access to projects and issues</li>
                </ul>
            </div>
        </div>
    );
};
