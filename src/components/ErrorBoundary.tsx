import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          maxWidth: '800px',
          margin: '2rem auto',
          backgroundColor: '#1e1e2e',
          color: '#f3f4f6',
          borderRadius: '12px',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h2 style={{ color: '#f43f5e', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ marginBottom: '1rem', color: '#9ca3af' }}>
            An unhandled runtime error occurred while rendering the application.
          </p>
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '1rem',
            borderRadius: '8px',
            overflowX: 'auto',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            color: '#fbbf24'
          }}>
            {this.state.error && this.state.error.toString()}
            {this.state.errorInfo && (
              <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: '#9ca3af' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem',
              padding: '0.6rem 1.2rem',
              backgroundColor: '#38bdf8',
              color: '#0f172a',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
