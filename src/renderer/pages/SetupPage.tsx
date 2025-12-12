import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../hooks/useUsers';
import { Button } from '../components/ui/button';
import { Loader2, Shield, UserPlus, CheckCircle, User, Mail, Phone, Globe, MessageSquare } from 'lucide-react';

export const SetupPage = () => {
    const navigate = useNavigate();
    const createUser = useCreateUser();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        username: '',
        display_name: '',
        email: '',
        phone: '',
        bio: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        password: '',
        confirmPassword: '',
    });

    const validateStep1 = () => {
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
        } else if (formData.display_name.length < 2) {
            newErrors.display_name = 'Display name must be at least 2 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: Record<string, string> = {};

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number format';
        }

        if (formData.bio && formData.bio.length > 500) {
            newErrors.bio = 'Bio must be less than 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        setCurrentStep(1);
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep2()) {
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

            // Store additional profile data
            const profiles = JSON.parse(localStorage.getItem('homesprint_profiles') || '{}');
            profiles[formData.username] = {
                phone: formData.phone,
                bio: formData.bio,
                timezone: formData.timezone,
                createdAt: new Date().toISOString(),
            };
            localStorage.setItem('homesprint_profiles', JSON.stringify(profiles));

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
            <div className="w-full max-w-2xl space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-teal mb-4 shadow-lg shadow-primary/30">
                        <Shield className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                        Welcome to HomeSprint!
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Let's set up your admin account to get started
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4">
                    <div className={`flex items-center gap-2 ${currentStep === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                            1
                        </div>
                        <span className="text-sm font-medium">Account</span>
                    </div>
                    <div className="w-12 h-0.5 bg-border" />
                    <div className={`flex items-center gap-2 ${currentStep === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                            2
                        </div>
                        <span className="text-sm font-medium">Profile</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-card p-8 rounded-xl border shadow-xl space-y-6">
                    {currentStep === 1 ? (
                        <>
                            {/* Step 1: Account Credentials */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <User className="h-6 w-6 text-primary" />
                                    Account Credentials
                                </h2>
                                <div className="grid grid-cols-2 gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                                    <div className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-foreground">Full Admin Access</p>
                                            <p className="text-muted-foreground text-xs">Manage all users and settings</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-foreground">Create Users</p>
                                            <p className="text-muted-foreground text-xs">Add family/team members</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold flex items-center gap-1">
                                            <User className="h-3.5 w-3.5" />
                                            Username <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            required
                                            className={`flex h-11 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
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
                                            <p className="text-xs text-destructive flex items-center gap-1">
                                                {errors.username}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">
                                            Display Name <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            required
                                            className={`flex h-11 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
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

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">
                                            Password <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            className={`flex h-11 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
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
                                        <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">
                                            Confirm Password <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            className={`flex h-11 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
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
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-full bg-gradient-teal hover:opacity-90 transition-opacity"
                                    size="lg"
                                >
                                    Continue to Profile
                                    <span className="ml-2">→</span>
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Step 2: Profile Details */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                    Profile Details
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Add more information to personalize your profile (all optional)
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold flex items-center gap-1">
                                            <Mail className="h-3.5 w-3.5" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className={`flex h-11 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
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
                                        <label className="text-sm font-semibold flex items-center gap-1">
                                            <Phone className="h-3.5 w-3.5" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            className={`flex h-11 w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                                                errors.phone ? 'border-destructive' : 'border-input bg-background'
                                            }`}
                                            placeholder="+1 (555) 123-4567"
                                            value={formData.phone}
                                            onChange={e => {
                                                setFormData({ ...formData, phone: e.target.value });
                                                if (errors.phone) setErrors({ ...errors, phone: '' });
                                            }}
                                        />
                                        {errors.phone && (
                                            <p className="text-xs text-destructive">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold flex items-center gap-1">
                                        <Globe className="h-3.5 w-3.5" />
                                        Timezone
                                    </label>
                                    <select
                                        className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                        value={formData.timezone}
                                        onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                                    >
                                        <option value="America/New_York">Eastern Time (ET)</option>
                                        <option value="America/Chicago">Central Time (CT)</option>
                                        <option value="America/Denver">Mountain Time (MT)</option>
                                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                        <option value="Europe/London">London (GMT)</option>
                                        <option value="Europe/Paris">Paris (CET)</option>
                                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                                        <option value="Asia/Shanghai">Shanghai (CST)</option>
                                        <option value="Australia/Sydney">Sydney (AEST)</option>
                                        <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                                            {Intl.DateTimeFormat().resolvedOptions().timeZone} (Auto-detected)
                                        </option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">
                                        Bio / About You
                                    </label>
                                    <textarea
                                        className={`flex min-h-[120px] w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none ${
                                            errors.bio ? 'border-destructive' : 'border-input bg-background'
                                        }`}
                                        placeholder="Tell us a bit about yourself... What are your responsibilities? What do you want to achieve with HomeSprint?"
                                        value={formData.bio}
                                        onChange={e => {
                                            setFormData({ ...formData, bio: e.target.value });
                                            if (errors.bio) setErrors({ ...errors, bio: '' });
                                        }}
                                        maxLength={500}
                                    />
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        {errors.bio ? (
                                            <p className="text-destructive">{errors.bio}</p>
                                        ) : (
                                            <span>Share your role and goals</span>
                                        )}
                                        <span>{formData.bio.length}/500</span>
                                    </div>
                                </div>

                                {errors.submit && (
                                    <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                                        <p className="text-sm text-destructive font-medium">{errors.submit}</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        onClick={handleBack}
                                        variant="outline"
                                        className="w-1/3"
                                        size="lg"
                                    >
                                        ← Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-gradient-teal hover:opacity-90 transition-opacity"
                                        size="lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="mr-2 h-4 w-4" />
                                                Create Admin Account
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                <p className="text-center text-sm text-muted-foreground">
                    This will be your main administrative account. You can create additional users later.
                </p>
            </div>
        </div>
    );
};
