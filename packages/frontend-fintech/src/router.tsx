import {
  RouterProvider,
  createBrowserRouter,
  defer,
  redirect,
} from "react-router-dom";
import { loadQuery, useRelayEnvironment } from "react-relay";
import { RelayEnvironment } from "./RelayEnvironment";
import {
  authUserQuery,
  defaultBorrower,
  defaultLender,
  defaultSupport,
  getUserDataCache,
} from "./utils";
import { PageLoader } from "./components/PageLoader";
import {
  EntryPointRouteObject,
  preparePreloadableRoutes,
} from "@loop-payments/react-router-relay";
import { useMemo, useRef } from "react";
import { ApproveLoanEntryPoint } from "./screens/ApproveLoan/ApproveLoan.entrypoint";
import { HeaderAuthEntryPoint } from "./screens/HeaderAuth/HeaderAuth.entrypoint";
import { AddLoanEntryPoint } from "./screens/AddLoan/AddLoan.entrypoint";
import { AddFundsEntryPoint } from "./screens/AddFunds/AddFunds.entrypoint";
import { AddInvestmentsEntryPoint } from "./screens/AddInvestments/AddInvestments.entrypoint";
import { MyLoansEntryPoint } from "./screens/MyLoans/MyLoans.entrypoint";
import { MyTransactionsEntryPoint } from "./screens/MyTransactions/MyTransactions.entrypoint";
import { RetireFundsEntryPoint } from "./screens/RetireFunds/RetireFunds.entrypoint";
import { AccountEntryPoint } from "./screens/Account/Account.entrypoint";
import { SettingsEntryPoint } from "./screens/Settings/Settings.entrypoint";
import { MyInvestmentsEntryPoint } from "./screens/MyInvestments/MyInvestments.entrypoints";

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

const authQuery = loadQuery(RelayEnvironment, authUserQuery, {});

const MY_ROUTES: EntryPointRouteObject[] = [
  {
    path: "/",
    entryPoint: HeaderAuthEntryPoint,
    errorElement: <div>Error</div>,
    children: [
      {
        path: "/login",
        element: <PageLoader />,
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
          const page = import("./screens/LogIn/LogIn");
          return defer({ page, authQuery });
        },
      },
      {
        path: "/register",
        element: <PageLoader />,
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
          const page = import("./screens/SignUp/SignUp");
          return defer({ page, authQuery });
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
  const environment = useRelayEnvironment();
  const environmentRef = useRef(environment);
  const router = useMemo(() => {
    const routes = preparePreloadableRoutes(MY_ROUTES, {
      getEnvironment() {
        return environmentRef.current;
      },
    });

    return createBrowserRouter(routes);
  }, []);

  return <RouterProvider router={router} />;
};
