import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Boundary caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-8 bg-red-50">
                    <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl space-y-4 border border-red-100">
                        <h2 className="text-xl font-black text-red-900">Application Error</h2>
                        <pre className="text-xs bg-slate-50 p-4 rounded-xl overflow-auto max-h-[40vh] text-red-600 font-mono">
                            {this.state.error?.toString()}
                        </pre>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="w-full py-3 bg-red-600 text-white rounded-xl font-bold"
                        >
                            Back to Safety
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
