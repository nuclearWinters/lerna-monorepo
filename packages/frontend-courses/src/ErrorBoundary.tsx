import React, { ReactNode } from "react";
import { ModuleLoaderError } from "RelayMatchContainer";

export default class ErrorBoundary extends React.Component<
  {
    shouldCatchError?: (error: ModuleLoaderError) => boolean;
    renderError: (error: ModuleLoaderError, resetError: () => void) => any;
    children: ReactNode;
  },
  { error: ModuleLoaderError | null }
> {
  static getDerivedStateFromError(error: ModuleLoaderError) {
    return { error };
  }

  componentDidCatch(error: ModuleLoaderError) {
    if (!this.props.shouldCatchError || this.props.shouldCatchError(error)) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state && this.state.error) {
      return this.props.renderError(this.state.error, this._resetError);
    }
    return this.props.children;
  }

  _resetError = () => {
    this.setState({ error: null });
  };
}
