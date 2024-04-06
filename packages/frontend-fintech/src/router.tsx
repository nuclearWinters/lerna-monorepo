import { createBrowserRouter, defer, redirect } from "react-router-dom";
import { loadQuery } from "react-relay";
import { RelayEnvironment } from "./RelayEnvironment";
import { HeaderAuth } from "./screens/HeaderAuth/HeaderAuth";
import {
  authUserQuery,
  defaultBorrower,
  defaultLender,
  defaultSupport,
  getUserDataCache,
} from "./utils";
import { settingsFragment } from "./screens/Settings/SettingsQueries";
import { accountFragment } from "./screens/Account/AccountQueries";
import { transactionsFragment } from "./screens/MyTransactions/MyTransactionsQueries";
import { addInvestmentFragment } from "./screens/AddInvestments/AddInvestmentsQueries";
import { approveLoansFragment } from "./screens/ApproveLoan/ApproveLoanQueries";
import { myLoansFragment } from "./screens/MyLoans/MyLoansQueries";
import { myInvestmentsFragment } from "./screens/MyInvestments/MyInvestmentsQueries";
import { PageLoader } from "./components/PageLoader";

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HeaderAuth />,
    errorElement: <div>Error</div>,
    loader: async () => {
      return {
        query: authQuery,
      };
    },
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
        element: <PageLoader />,
        loader: async () => {
          const path = redirectPage(
            ["borrower", "lender", "support"],
            "/settings"
          );
          if (path) {
            return redirect(path);
          }
          const page = import("./screens/Settings/Settings");
          const query = loadQuery(
            RelayEnvironment,
            settingsFragment,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query });
        },
      },
      {
        path: "/account",
        element: <PageLoader />,
        loader: async () => {
          const path = redirectPage(["borrower", "lender"], "/account");
          if (path) {
            return path;
          }
          const page = import("./screens/Account/Account");
          const query = loadQuery(
            RelayEnvironment,
            accountFragment,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query, authQuery });
        },
      },
      {
        path: "/myTransactions",
        element: <PageLoader />,
        loader: async () => {
          const path = redirectPage(["borrower", "lender"], "/myTransactions");
          if (path) {
            return path;
          }
          const page = import("./screens/MyTransactions/MyTransactions");
          const query = loadQuery(
            RelayEnvironment,
            transactionsFragment,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query, authQuery });
        },
      },
      {
        path: "/addFunds",
        element: <PageLoader />,
        loader: async () => {
          const path = redirectPage(["borrower", "lender"], "/addFunds");
          if (path) {
            return path;
          }
          const page = import("./screens/AddFunds/AddFunds");
          return defer({ page, authQuery });
        },
      },
      {
        path: "/retireFunds",
        element: <PageLoader />,
        loader: async () => {
          const path = redirectPage(["borrower", "lender"], "/retireFunds");
          if (path) {
            return path;
          }
          const page = import("./screens/RetireFunds/RetireFunds");
          return defer({ page, authQuery });
        },
      },
      {
        path: "/addInvestments",
        element: <PageLoader />,
        loader: async () => {
          const path = redirectPage(["lender"], "/addInvestments");
          if (path) {
            return path;
          }
          const page = import("./screens/AddInvestments/AddInvestments");
          const query = loadQuery(
            RelayEnvironment,
            addInvestmentFragment,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query, authQuery });
        },
      },
      {
        path: "/addLoan",
        element: <PageLoader />,
        loader: async () => {
          const path = redirectPage(["borrower"], "/addLoan");
          if (path) {
            return path;
          }
          const page = import("./screens/AddLoan/AddLoan");
          return defer({ page, authQuery });
        },
      },
      {
        path: "/approveLoan",
        element: <PageLoader />,
        loader: async () => {
          const path = redirectPage(["support"], "/approveLoan");
          if (path) {
            return path;
          }
          const page = import("./screens/ApproveLoan/ApproveLoan");
          const query = loadQuery(
            RelayEnvironment,
            approveLoansFragment,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query, authQuery });
        },
      },
      {
        path: "/myLoans",
        element: <PageLoader />,
        loader: async () => {
          const path = redirectPage(["borrower"], "/myLoans");
          if (path) {
            return path;
          }
          const page = import("./screens/MyLoans/MyLoans");
          const query = loadQuery(
            RelayEnvironment,
            myLoansFragment,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query, authQuery });
        },
      },
      {
        path: "/myInvestments",
        element: <PageLoader />,
        loader: async () => {
          const path = redirectPage(["lender"], "/myInvestments");
          if (path) {
            return path;
          }
          const page = import("./screens/MyInvestments/MyInvestments");
          const query = loadQuery(
            RelayEnvironment,
            myInvestmentsFragment,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query, authQuery });
        },
      },
    ],
  },
]);
