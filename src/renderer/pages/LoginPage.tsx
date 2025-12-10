import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(formData.username, formData.password);
            if (success) {
                navigate('/');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md space-y-8 p-8">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-2xl">HS</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">HomeSprint</h1>
                    <p className="text-muted-foreground mt-2">
                        Sign in to manage your household chaos
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border shadow-sm">
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="admin"
                            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="admin"
                            className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="enterprise"
                        className="w-full"
                        disabled={isLoading || !formData.username || !formData.password}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                <div className="bg-muted/50 rounded-lg p-4 text-sm text-center">
                    <p className="font-medium mb-1">Default Credentials</p>
                    <p className="text-muted-foreground">
                        Username: <code className="bg-background px-2 py-1 rounded">admin</code><br />
                        Password: <code className="bg-background px-2 py-1 rounded">admin</code>
                    </p>
                </div>
            </div>
        </div>
    );
};
