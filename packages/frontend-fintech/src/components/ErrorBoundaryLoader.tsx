import { getUserDataCache } from "Routes";
import React, { ReactNode } from "react";
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
type Props = { children: ReactNode; navigate: NavigateFunction };

export class ErrorBoundaryLoader extends React.Component<Props, State> {
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
    const { navigate } = this.props;
    const { errorMessage } = this.state;
    if (errorMessage === "Unauthenticated") {
      navigate("/login");
    } else if (errorMessage === "Unauthorized") {
      const userData = getUserDataCache();
      if (userData) {
        if (userData.isBorrower) {
          navigate("/myLoans");
        } else if (userData.isSupport) {
          navigate("/approveLoan");
        } else {
          navigate("/addInvestments");
        }
      }
    }
  }
  render() {
    const { children } = this.props;
    const { errorMessage } = this.state;
    return errorMessage ? null : children;
  }
}
