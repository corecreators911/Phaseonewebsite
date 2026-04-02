import React, { Component } from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  resetKey?: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, info.componentStack);
    }
  }


  componentDidUpdate(prevProps: Props) {
    if (this.state.hasError && this.props.resetKey !== prevProps.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center min-h-[200px] bg-black text-neutral-500 text-sm font-mono">
            Something went wrong. Please refresh the page.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
