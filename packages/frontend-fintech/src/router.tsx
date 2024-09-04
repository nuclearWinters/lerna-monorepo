import {
  Decode,
  defaultBorrower,
  defaultLender,
  defaultSupport,
  getUserDataCache,
} from "./utils";
import { ApproveLoanEntryPoint } from "./authSrc/screens/ApproveLoan/ApproveLoan.entrypoint";
import { HeaderAuthEntryPoint } from "./authSrc/screens/HeaderAuth/HeaderAuth.entrypoint";
import { AddLoanEntryPoint } from "./authSrc/screens/AddLoan/AddLoan.entrypoint";
import { AddFundsEntryPoint } from "./authSrc/screens/AddFunds/AddFunds.entrypoint";
import { AddInvestmentsEntryPoint } from "./authSrc/screens/AddInvestments/AddInvestments.entrypoint";
import { MyLoansEntryPoint } from "./authSrc/screens/MyLoans/MyLoans.entrypoint";
import { MyTransactionsEntryPoint } from "./authSrc/screens/MyTransactions/MyTransactions.entrypoint";
import { RetireFundsEntryPoint } from "./authSrc/screens/RetireFunds/RetireFunds.entrypoint";
import { AccountEntryPoint } from "./authSrc/screens/Account/Account.entrypoint";
import { SettingsEntryPoint } from "./authSrc/screens/Settings/Settings.entrypoint";
import { MyInvestmentsEntryPoint } from "./authSrc/screens/MyInvestments/MyInvestments.entrypoints";
import { LogInEntryPoint } from "./authSrc/screens/LogIn/LogIn.entrypoint";
import { SignUpEntryPoint } from "./authSrc/screens/SignUp/SignUp.entrypoint";
import { Routes } from "./react-router-elements/Router";
import { Route } from "./react-router-elements/Route";
import { loadEntryPoint, PreloadedEntryPoint } from "react-relay";
import {
  RelayEnvironmentAuth,
  RelayEnvironmentFintech,
} from "./RelayEnvironment";
import { GetEntryPointComponentFromEntryPoint } from "react-relay/relay-hooks/helpers";
import { RouteLogin } from "./react-router-elements/RouteLogin";
import { historyReplace } from "./react-router-elements/utils";

const allowedPages = {
  borrower: [
    "/account",
    "/myTransactions",
    "/addFunds",
    "/retireFunds",
    "/settings",
    "/myLoans",
    "/addLoan",
  ],
  lender: [
    "/account",
    "/myTransactions",
    "/addFunds",
    "/retireFunds",
    "/settings",
    "/myInvestments",
    "/addInvestments",
  ],
  support: ["/approveLoan", "/settings"],
};

const getRedirectPath = (
  path: UserPages,
  data: Decode | null
): {
  path: "/myLoans" | "/addInvestments" | "/approveLoan" | "/";
  params: string | null;
} | null => {
  if (data) {
    if (
      (allowedPages["borrower"].includes(path) && data.isBorrower) ||
      (allowedPages["lender"].includes(path) && data.isLender) ||
      (allowedPages["support"].includes(path) && data.isSupport)
    ) {
      return null;
    } else {
      if (data.isBorrower) {
        return { path: defaultBorrower, params: null };
      } else if (data.isLender) {
        return { path: defaultLender, params: null };
      } else {
        return { path: defaultSupport, params: null };
      }
    }
  }
  return { path: "/", params: `redirectTo=${path}` };
};

const headerEntryPointReference = loadEntryPoint(
  {
    getEnvironment: (options) => {
      return options?.environment === "auth"
        ? RelayEnvironmentAuth
        : RelayEnvironmentFintech;
    },
  },
  HeaderAuthEntryPoint,
  {}
);

export const references = {
  "/": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof LogInEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        LogInEntryPoint,
        {}
      );
      references["/"].entrypoint = reference;
      return reference;
    },
  },
  "/register": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof SignUpEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        SignUpEntryPoint,
        {}
      );
      references["/register"].entrypoint = reference;
      return reference;
    },
  },
  "/settings": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof SettingsEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        SettingsEntryPoint,
        {}
      );
      references["/settings"].entrypoint = reference;
      return reference;
    },
  },
  "/account": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof AccountEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        AccountEntryPoint,
        {}
      );
      references["/account"].entrypoint = reference;
      return reference;
    },
  },
  "/myTransactions": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof MyTransactionsEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        MyTransactionsEntryPoint,
        {}
      );
      references["/myTransactions"].entrypoint = reference;
      return reference;
    },
  },
  "/addFunds": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof AddFundsEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        AddFundsEntryPoint,
        {}
      );
      references["/addFunds"].entrypoint = reference;
      return reference;
    },
  },
  "/retireFunds": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof RetireFundsEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        RetireFundsEntryPoint,
        {}
      );
      references["/retireFunds"].entrypoint = reference;
      return reference;
    },
  },
  "/addInvestments": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof AddInvestmentsEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        AddInvestmentsEntryPoint,
        {}
      );
      references["/addInvestments"].entrypoint = reference;
      return reference;
    },
  },
  "/addLoan": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof AddLoanEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        AddLoanEntryPoint,
        {}
      );
      references["/addLoan"].entrypoint = reference;
      return reference;
    },
  },
  "/approveLoan": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof ApproveLoanEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        ApproveLoanEntryPoint,
        {}
      );
      references["/approveLoan"].entrypoint = reference;
      return reference;
    },
  },
  "/myLoans": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof MyLoansEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        MyLoansEntryPoint,
        {}
      );
      references["/myLoans"].entrypoint = reference;
      return reference;
    },
  },
  "/myInvestments": {
    entrypoint: null as PreloadedEntryPoint<
      GetEntryPointComponentFromEntryPoint<typeof MyInvestmentsEntryPoint>
    > | null,
    loader: () => {
      const reference = loadEntryPoint(
        {
          getEnvironment: (options) => {
            return options?.environment === "auth"
              ? RelayEnvironmentAuth
              : RelayEnvironmentFintech;
          },
        },
        MyInvestmentsEntryPoint,
        {}
      );
      references["/myInvestments"].entrypoint = reference;
      return reference;
    },
  },
};

const pathname = window.location.pathname;
console.log("getUserDataCache:", getUserDataCache);
const data = getUserDataCache();

const sessionPages = ["/", "/register"];

type SessionPages = "/" | "/register";

const isSessionPage = (path: string): path is SessionPages => {
  return sessionPages.includes(path);
};

type UserPages =
  | "/approveLoan"
  | "/settings"
  | "/addInvestments"
  | "/myInvestments"
  | "/addLoan"
  | "/myLoans"
  | "/account"
  | "/myTransactions"
  | "/addFunds"
  | "/retireFunds";

const isUserPage = (path: string): path is UserPages => {
  return [
    "/approveLoan",
    "/settings",
    "/addInvestments",
    "/myInvestments",
    "/addLoan",
    "/myLoans",
    "/account",
    "/myTransactions",
    "/addFunds",
    "/retireFunds",
  ].includes(path);
};

if (isSessionPage(pathname)) {
  if (data?.isBorrower) {
    references[defaultBorrower].loader();
    historyReplace(defaultBorrower);
  }
  if (data?.isSupport) {
    references[defaultSupport].loader();
    historyReplace(defaultSupport);
  }
  if (data?.isLender) {
    references[defaultLender].loader();
    historyReplace(defaultLender);
  } else {
    references[pathname].loader();
  }
} else if (isUserPage(pathname)) {
  const redirectPath = getRedirectPath(pathname, data);
  if (redirectPath) {
    references[redirectPath.path].loader();
    historyReplace(
      `${redirectPath.path}${redirectPath.params ? `?${redirectPath.params}` : ""}`
    );
  } else {
    references[pathname].loader();
  }
}

export const MyRouter = () => {
  return (
    <Routes entryPointReference={headerEntryPointReference}>
      <RouteLogin entryPointReference={references["/"].entrypoint} />
      <Route
        path="/register"
        entryPointReference={references["/register"].entrypoint}
      />
      <Route
        path="/settings"
        entryPointReference={references["/settings"].entrypoint}
      />
      <Route
        path="/account"
        entryPointReference={references["/account"].entrypoint}
      />
      <Route
        path="/myTransactions"
        entryPointReference={references["/myTransactions"].entrypoint}
      />
      <Route
        path="/addFunds"
        entryPointReference={references["/addFunds"].entrypoint}
      />
      <Route
        path="/retireFunds"
        entryPointReference={references["/retireFunds"].entrypoint}
      />
      <Route
        path="/addInvestments"
        entryPointReference={references["/addInvestments"].entrypoint}
      />
      <Route
        path="/addLoan"
        entryPointReference={references["/addLoan"].entrypoint}
      />
      <Route
        path="/approveLoan"
        entryPointReference={references["/approveLoan"].entrypoint}
      />
      <Route
        path="/myLoans"
        entryPointReference={references["/myLoans"].entrypoint}
      />
      <Route
        path="/myInvestments"
        entryPointReference={references["/myInvestments"].entrypoint}
      />
    </Routes>
  );
};
