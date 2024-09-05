import React, { ReactNode } from "react";

interface ErrorBoundaryState extends Error {
  source: string;
}

export default class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { error: ErrorBoundaryState | null }
> {
  state = { error: null as ErrorBoundaryState | null };
  static getDerivedStateFromError(error: ErrorBoundaryState) {
    return {
      error,
    };
  }

  render() {
    if (this.state.error != null) {
      return (
        <div>
          <div>Error: {this.state.error.message}</div>
          <div>
            <pre>{JSON.stringify(this.state.error.source, null, 2)}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
