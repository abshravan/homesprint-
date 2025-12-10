import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // In production, you could send this to a logging service
        // For now, we'll just log it to console
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });

        // Reload the current route
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
                    <div className="max-w-md w-full space-y-4 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-destructive">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-muted-foreground">
                                The application encountered an unexpected error. Don't worry, your data is safe.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left">
                                <summary className="cursor-pointer text-sm font-medium mb-2">
                                    Error Details (Development Only)
                                </summary>
                                <div className="p-4 bg-card border rounded-md space-y-2 text-xs">
                                    <div>
                                        <strong>Error:</strong>
                                        <pre className="mt-1 whitespace-pre-wrap break-words">
                                            {this.state.error.toString()}
                                        </pre>
                                    </div>
                                    {this.state.errorInfo && (
                                        <div>
                                            <strong>Stack Trace:</strong>
                                            <pre className="mt-1 whitespace-pre-wrap break-words text-muted-foreground">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}

                        <div className="space-y-2">
                            <Button onClick={this.handleReset} className="w-full">
                                Reload Application
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="w-full"
                            >
                                Go Back
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            If this problem persists, try restarting the application.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
