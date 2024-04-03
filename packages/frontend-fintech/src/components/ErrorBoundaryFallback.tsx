import { Component, ReactNode } from "react";
import { NavigateFunction } from "react-router-dom";

interface RelayError {
  message: string;
  source: {
    errors: {
      message: string;
    }[];
  };
}

const isRelayError = (object: any): object is RelayError => {
  return "source" in object;
};

type State = { errorMessage: string };
type Props = {
  children: ReactNode;
  fallback: ReactNode;
  navigate: NavigateFunction;
  pathname: string;
};

export class ErrorBoundaryFallback extends Component<Props, State> {
  state = { errorMessage: "" };
  static getDerivedStateFromError(error: unknown): State {
    if (isRelayError(error)) {
      return { errorMessage: error?.source?.errors?.[0]?.message || "" };
    } else if (error instanceof Error) {
      return { errorMessage: error.message };
    }
    return { errorMessage: "Error" };
  }
  componentDidCatch() {
    const { navigate, pathname } = this.props;
    const { errorMessage } = this.state;
    if (errorMessage === "Unauthenticated") {
      const isLoggedPage = !["/login", "/register", "/"].includes(pathname);
      navigate(`/login${isLoggedPage ? `?redirectTo=${pathname}` : ""}`);
    }
  }
  render() {
    const { children, fallback } = this.props;
    const { errorMessage } = this.state;
    return errorMessage ? fallback : children;
  }
}
