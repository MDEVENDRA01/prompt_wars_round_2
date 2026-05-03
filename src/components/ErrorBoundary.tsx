/**
 * @file ErrorBoundary.tsx
 * @description Class-based component for catching JavaScript errors in child component trees.
 */

import { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Properties for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  /** The child components to be protected by this boundary. */
  children: ReactNode;
  /** Custom UI to display when an error is caught. */
  errorFallbackUI?: ReactNode;
  /** Descriptive name of the component or feature being wrapped, for logging purposes. */
  targetComponentName: string;
}

/**
 * Internal state for the ErrorBoundary component.
 */
interface ErrorBoundaryState {
  /** Whether a runtime error has been detected in the child tree. */
  hasEncounteredRuntimeError: boolean;
}

/**
 * A robust Error Boundary that catches asynchronous and rendering errors in its child tree.
 * Prevents a single component failure from crashing the entire application.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasEncounteredRuntimeError: false,
  };

  /**
   * Updates state so the next render shows the fallback UI.
   * 
   * @returns {ErrorBoundaryState} The new state reflecting the error.
   */
  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasEncounteredRuntimeError: true };
  }

  /**
   * Side-effect handler for when an error is caught.
   * Logs error details to the console for developer inspection.
   * 
   * @param {Error} error - The caught error object.
   * @param {ErrorInfo} errorInformation - Metadata about where the error occurred in the React tree.
   */
  public componentDidCatch(error: Error, errorInformation: ErrorInfo) {
    console.error(
      `[ErrorBoundary] Runtime error detected in <${this.props.targetComponentName}>:`, 
      error, 
      errorInformation
    );
  }

  public render() {
    if (this.state.hasEncounteredRuntimeError) {
      // Return custom fallback if provided, otherwise a generic fallback
      return this.props.errorFallbackUI || (
        <div 
          className="error-boundary-fallback" 
          role="alert" 
          style={{ padding: '2rem', textAlign: 'center', border: '1px solid var(--border)' }}
        >
          <strong>Unable to load section: {this.props.targetComponentName}</strong>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
            Please try refreshing the page or check your connection.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

