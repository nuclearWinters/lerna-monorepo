import { createBrowserRouter, defer, redirect } from "react-router-dom";
import { loadQuery } from "react-relay";
import { RelayEnvironment } from "./RelayEnvironment";
import { HeaderAuth } from "./screens/HeaderAuth/HeaderAuth";
import { LogInLoader } from "./screens/LogIn/LogInLoader";
import {
  authUserQuery,
  defaultBorrower,
  defaultLender,
  defaultSupport,
  getUserDataCache,
} from "./utils";
import { SignUpLoader } from "./screens/SignUp/SignUpLoader";
import { SettingsLoader } from "./screens/Settings/SettingsLoader";
import { settingsFragment } from "./screens/Settings/SettingsQueries";
import { AccountLoader } from "./screens/Account/AccountLoader";
import { accountFragment } from "./screens/Account/AccountQueries";
import { MyTransactionsLoader } from "./screens/MyTransactions/MyTransactionsLoader";
import { transactionsFragment } from "./screens/MyTransactions/MyTransactionsQueries";
import { AddFundsLoader } from "./screens/AddFunds/AddFundsLoader";
import { RetireFundsLoader } from "./screens/RetireFunds/RetireFundsLoader";
import { AddInvestmentsLoader } from "./screens/AddInvestments/AddInvestmentsLoader";
import { AddLoanLoader } from "./screens/AddLoan/AddLoanLoader";
import { ApproveLoanLoader } from "./screens/ApproveLoan/ApproveLoanLoader";
import { MyLoansLoader } from "./screens/MyLoans/MyLoansLoader";
import { MyInvestmentsLoader } from "./screens/MyInvestments/MyInvestmentsLoader";
import { addInvestmentFragment } from "./screens/AddInvestments/AddInvestmentsQueries";
import { approveLoansFragment } from "./screens/ApproveLoan/ApproveLoanQueries";
import { myLoansFragment } from "./screens/MyLoans/MyLoansQueries";
import { myInvestmentsFragment } from "./screens/MyInvestments/MyInvestmentsQueries";

const authQuery = loadQuery(RelayEnvironment, authUserQuery, {});

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HeaderAuth />,
    errorElement: <div>Error test</div>,
    loader: async () => {
      return {
        query: authQuery,
      };
    },
    children: [
      {
        path: "/login",
        element: <LogInLoader />,
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
        element: <SignUpLoader />,
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
          return defer({ page });
        },
      },
      {
        path: "/settings",
        element: <SettingsLoader />,
        loader: async () => {
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
        element: <AccountLoader />,
        loader: async () => {
          const data = getUserDataCache();
          if (data?.isSupport) {
            return redirect(defaultSupport);
          }
          const page = import("./screens/Account/Account");
          const query = loadQuery(
            RelayEnvironment,
            accountFragment,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query });
        },
      },
      {
        path: "/myTransactions",
        element: <MyTransactionsLoader />,
        loader: async () => {
          const page = import("./screens/MyTransactions/MyTransactions");
          const query = loadQuery(
            RelayEnvironment,
            transactionsFragment,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query });
        },
      },
      {
        path: "/addFunds",
        element: <AddFundsLoader />,
        loader: async () => {
          const page = import("./screens/AddFunds/AddFunds");
          return defer({ page });
        },
      },
      {
        path: "/retireFunds",
        element: <RetireFundsLoader />,
        loader: async () => {
          const page = import("./screens/RetireFunds/RetireFunds");
          return defer({ page });
        },
      },
      {
        path: "/addInvestments",
        element: <AddInvestmentsLoader />,
        loader: async () => {
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
        element: <AddLoanLoader />,
        loader: async () => {
          const page = import("./screens/AddLoan/AddLoan");
          return defer({ page });
        },
      },
      {
        path: "/approveLoan",
        element: <ApproveLoanLoader />,
        loader: async () => {
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
        element: <MyLoansLoader />,
        loader: async () => {
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
        element: <MyInvestmentsLoader />,
        loader: async () => {
          const page = import("./screens/MyInvestments/MyInvestments");
          const query = loadQuery(
            RelayEnvironment,
            myInvestmentsFragment,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query });
        },
      },
    ],
  },
]);
