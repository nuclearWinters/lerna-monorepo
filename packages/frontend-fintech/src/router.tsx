import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import {
  RelayEnvironmentAuth,
  RelayEnvironmentFintech,
} from "./RelayEnvironment";
import {
  defaultBorrower,
  defaultLender,
  defaultSupport,
  getUserDataCache,
} from "./utils";
import { useMemo } from "react";
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
import {
  EntryPointRouteObject,
  preparePreloadableRoutes,
} from "./react-router-relay";

type inputUser = "lender" | "borrower" | "support";

const redirectPage = (
  allowedUsers: inputUser[],
  path: string
): string | null => {
  const data = getUserDataCache();
  if (data) {
    if (
      (allowedUsers.includes("borrower") && data.isBorrower) ||
      (allowedUsers.includes("lender") && data.isLender) ||
      (allowedUsers.includes("support") && data.isSupport)
    ) {
      return null;
    } else {
      if (data.isBorrower) {
        return defaultBorrower;
      } else if (data.isLender) {
        return defaultLender;
      } else {
        return defaultSupport;
      }
    }
  }
  return `/login?redirectTo=${path}`;
};

const MY_ROUTES: EntryPointRouteObject[] = [
  {
    path: "/",
    entryPoint: HeaderAuthEntryPoint,
    errorElement: <div>Error</div>,
    children: [
      {
        path: "/login",
        entryPoint: LogInEntryPoint,
        loader: async () => {
          const data = getUserDataCache();
          if (data?.isBorrower) {
            return redirect(defaultBorrower);
          }
          if (data?.isSupport) {
            return redirect(defaultSupport);
          }
          if (data?.isLender) {
            return redirect(defaultLender);
          }
          return {};
        },
      },
      {
        path: "/register",
        entryPoint: SignUpEntryPoint,
        loader: async () => {
          const data = getUserDataCache();
          if (data?.isBorrower) {
            return redirect(defaultBorrower);
          }
          if (data?.isSupport) {
            return redirect(defaultSupport);
          }
          if (data?.isLender) {
            return redirect(defaultLender);
          }
          return {};
        },
      },
      {
        path: "/settings",
        entryPoint: SettingsEntryPoint,
        loader: async () => {
          const path = redirectPage(
            ["borrower", "lender", "support"],
            "/settings"
          );
          if (path) {
            return redirect(path);
          }
          return {};
        },
      },
      {
        path: "/account",
        entryPoint: AccountEntryPoint,
        loader: async () => {
          const path = redirectPage(["borrower", "lender"], "/account");
          if (path) {
            return redirect(path);
          }
          return {};
        },
      },
      {
        path: "/myTransactions",
        entryPoint: MyTransactionsEntryPoint,
        loader: async () => {
          const path = redirectPage(["borrower", "lender"], "/myTransactions");
          if (path) {
            return redirect(path);
          }
          return {};
        },
      },
      {
        path: "/addFunds",
        entryPoint: AddFundsEntryPoint,
        loader: async () => {
          const path = redirectPage(["borrower", "lender"], "/addFunds");
          if (path) {
            return redirect(path);
          }
          return {};
        },
      },
      {
        path: "/retireFunds",
        entryPoint: RetireFundsEntryPoint,
        loader: async () => {
          const path = redirectPage(["borrower", "lender"], "/retireFunds");
          if (path) {
            return redirect(path);
          }
          return {};
        },
      },
      {
        path: "/addInvestments",
        entryPoint: AddInvestmentsEntryPoint,
        loader: async () => {
          const path = redirectPage(["lender"], "/addInvestments");
          if (path) {
            return redirect(path);
          }
          return {};
        },
      },
      {
        path: "/addLoan",
        entryPoint: AddLoanEntryPoint,
        loader: async () => {
          const path = redirectPage(["borrower"], "/addLoan");
          if (path) {
            return redirect(path);
          }
          return {};
        },
      },
      {
        path: "/approveLoan",
        entryPoint: ApproveLoanEntryPoint,
        loader: async () => {
          const path = redirectPage(["support"], "/approveLoan");
          if (path) {
            return redirect(path);
          }
          return {};
        },
      },
      {
        path: "/myLoans",
        entryPoint: MyLoansEntryPoint,
        loader: async () => {
          const path = redirectPage(["borrower"], "/myLoans");
          if (path) {
            return redirect(path);
          }
          return {};
        },
      },
      {
        path: "/myInvestments",
        entryPoint: MyInvestmentsEntryPoint,
        loader: async () => {
          const path = redirectPage(["lender"], "/myInvestments");
          if (path) {
            return redirect(path);
          }
          return {};
        },
      },
    ],
  },
];

export const MyRouter = () => {
  const router = useMemo(() => {
    const routes = preparePreloadableRoutes(MY_ROUTES, {
      getEnvironment(options) {
        if (options?.environment === "auth") {
          return RelayEnvironmentAuth;
        }
        if (options?.environment === "fintech") {
          return RelayEnvironmentFintech;
        }
        return RelayEnvironmentAuth;
      },
    });

    return createBrowserRouter(routes);
  }, []);

  return <RouterProvider router={router} />;
};
