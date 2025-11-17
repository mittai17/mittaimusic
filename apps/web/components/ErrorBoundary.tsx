/**
 * Error Boundary Component
 */
import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from '../styles/ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.icon}>⚠️</div>
            <h1 className={styles.title}>Oops! Something went wrong</h1>
            <p className={styles.message}>
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            {this.state.error && (
              <details className={styles.details}>
                <summary>Error Details</summary>
                <pre className={styles.errorText}>{this.state.error.toString()}</pre>
              </details>
            )}
            <div className={styles.actions}>
              <button className={styles.primaryBtn} onClick={this.handleReset}>
                Go to Home
              </button>
              <button className={styles.secondaryBtn} onClick={() => window.location.reload()}>
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
