import React from "react";

interface ErrorReactComponent extends Error {
  source: unknown;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: ErrorReactComponent | null }
> {
  state = { error: null as ErrorReactComponent | null };
  static getDerivedStateFromError(error: Error) {
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
