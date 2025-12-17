import { useState } from 'react';
import { Settings, Trash2, AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { Button } from '../components/ui/button';
import { closeDatabase } from '../../lib/database';

export const SettingsPage = () => {
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isResetting, setIsResetting] = useState(false);

    const handleResetApp = async () => {
        if (confirmText !== 'RESET') {
            return;
        }

        setIsResetting(true);

        try {
            // Clear all localStorage data
            localStorage.clear();

            // Close the database connection
            closeDatabase();

            // Delete the entire IndexedDB database
            const deleteRequest = indexedDB.deleteDatabase('homesprint');

            deleteRequest.onsuccess = () => {
                console.log('Database deleted successfully');
                // Redirect to setup page after deletion
                setTimeout(() => {
                    window.location.href = '#/setup';
                    window.location.reload();
                }, 500);
            };

            deleteRequest.onerror = () => {
                console.error('Error deleting database');
                alert('Failed to reset app. Please try again or clear browser data manually.');
                setIsResetting(false);
            };

            deleteRequest.onblocked = () => {
                console.warn('Database deletion blocked - close all tabs');
                alert('Please close all other tabs with this app open and try again.');
                setIsResetting(false);
            };
        } catch (error) {
            console.error('Error resetting app:', error);
            alert('Failed to reset app. Please try again or clear browser data manually.');
            setIsResetting(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="bg-gradient-teal-dark p-6 border-b border-primary/30">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Settings className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Global Configuration</h1>
                            <p className="text-teal-100 text-sm">System settings and data management</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-6 space-y-6">
                    {/* App Information */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            Application Information
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Version:</span>
                                <span className="font-mono text-primary">1.0.0 Enterprise</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Database:</span>
                                <span className="font-mono">IndexedDB v2</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Storage:</span>
                                <span className="font-mono">localStorage + IndexedDB</span>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-card border border-destructive/50 rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Danger Zone
                        </h2>

                        <div className="space-y-4">
                            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            Reset Application
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Permanently delete all data including users, issues, projects, boards, comments, and history.
                                            This action cannot be undone and will reset the app to initial setup state.
                                        </p>
                                        <ul className="text-xs text-muted-foreground space-y-1 mb-4 list-disc list-inside">
                                            <li>All user accounts will be deleted</li>
                                            <li>All issues and projects will be removed</li>
                                            <li>All comments and history will be erased</li>
                                            <li>All settings will be reset to defaults</li>
                                            <li>You will be redirected to the setup page</li>
                                        </ul>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() => setShowResetDialog(true)}
                                        className="shrink-0"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Reset App
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Section */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <RefreshCw className="h-5 w-5 text-muted-foreground" />
                            Additional Settings
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            More configuration options coming soon...
                        </p>
                        <ul className="text-xs text-muted-foreground mt-3 space-y-2 list-disc list-inside">
                            <li>Email notifications</li>
                            <li>Theme customization</li>
                            <li>Backup and restore</li>
                            <li>Export data</li>
                            <li>Integrations</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Reset Confirmation Dialog */}
            {showResetDialog && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-card border-2 border-destructive rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-destructive">Reset Application?</h3>
                                <p className="text-sm text-muted-foreground">This cannot be undone!</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
                                <p className="text-sm font-semibold text-destructive mb-2">
                                    ⚠️ Warning: All data will be permanently deleted
                                </p>
                                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>All users, issues, and projects</li>
                                    <li>All comments and activity history</li>
                                    <li>All settings and preferences</li>
                                </ul>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Type <span className="font-mono text-destructive">RESET</span> to confirm:
                                </label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="Type RESET here"
                                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-destructive text-sm font-mono"
                                    disabled={isResetting}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowResetDialog(false);
                                        setConfirmText('');
                                    }}
                                    className="flex-1"
                                    disabled={isResetting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleResetApp}
                                    disabled={confirmText !== 'RESET' || isResetting}
                                    className="flex-1"
                                >
                                    {isResetting ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Reset App
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
