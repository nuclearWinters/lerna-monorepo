import { createBrowserRouter, defer, redirect } from "react-router-dom";
import React from "react";
import { graphql, loadQuery } from "react-relay";
import { RelayEnvironment } from "RelayEnvironment";
import { HeaderAuth } from "pages/Header/Header";
import { Decode } from "pages/LogIn/LogIn";
import { MyTransactionsLoader } from "pages/MyTransactions";
import MyTransactionsQuery from "./pages/MyTransactions/__generated__/MyTransactionsQuery.graphql";
import AccountUserQuery from "./pages/Account/__generated__/AccountUserQuery.graphql";
import AddInvestmentsQuery from "./pages/AddInvestments/__generated__/AddInvestmentsQuery.graphql";
import ApproveLoansQuery from "./pages/ApproveLoan/__generated__/ApproveLoansQuery.graphql";
import SettingsAuthUserQuery from "./pages/Settings/__generated__/SettingsAuthUserQuery.graphql";
import MyInvestmentsQuery from "./pages/MyInvestments/__generated__/MyInvestmentsUserQuery.graphql";
import MyLoansQuery from "./pages/MyLoans/__generated__/MyLoansQuery.graphql";
import { AccountLoader } from "pages/Account";
import { AddFundsLoader } from "pages/AddFunds";
import { RetireFundsLoader } from "pages/RetireFunds";
import { AddInvestmentsLoader } from "pages/AddInvestments";
import { AddLoanLoader } from "pages/AddLoan";
import { ApproveLoanLoader } from "pages/ApproveLoan";
import * as stylex from "@stylexjs/stylex";
import { MyLoansLoader } from "pages/MyLoans";
import { LogInLoader } from "pages/LogIn";
import { SignUpLoader } from "pages/SignUp";
import { MyInvestmentsLoader } from "pages/MyInvestments";

export const baseRoutes = stylex.create({
  base: {
    flexDirection: "row",
    height: "100vh",
    width: "100vw",
    display: "grid",
    gridTemplateColumns: "126px 1fr",
    gridAutoRows: "60px 1fr",
  },
});

export const baseRoutesHeaderLogged = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export const baseRoutesHeaderNotLogged = stylex.create({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const baseRoutesContent = stylex.create({
  base: {
    flex: "1",
    display: "flex",
    backgroundColor: "rgb(248,248,248)",
    gridRowStart: "2",
    gridRowEnd: "2",
    gridColumnStart: "2",
    gridColumnEnd: "3",
  },
});

export const baseRoutesLink = stylex.create({
  base: {
    textAlign: "end",
    textDecoration: "none",
    color: "black",
    marginLeft: "10px",
  },
});

export const baseRoutesIconUser = stylex.create({
  base: {
    fontSize: "28px",
    margin: "12px 0px 12px 0px",
  },
  logged: {
    color: "rgba(255,90,96,0.5)",
  },
  notLogged: {
    color: "rgb(140,140,140)",
  },
});

export const baseHeader = stylex.create({
  base: {
    gridColumnStart: "2",
    gridColumnEnd: "2",
    gridRowStart: "1",
    gridRowEnd: "2",
  },
  fallback: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const baseSider = stylex.create({
  base: {
    gridRowStart: "1",
    gridRowEnd: "3",
    gridColumnStart: "1",
    gridColumnEnd: "1",
    display: "flex",
  },
});

export const baseRoutesIconLogout = stylex.create({
  base: {
    margin: "0px 10px",
    cursor: "pointer",
    color: "rgb(62,62,62)",
    fontSize: "28px",
  },
});

export const baseRoutesIcon = stylex.create({
  base: {
    fontSize: "28px",
  },
});

export const getUserDataCache = (): Decode | null => {
  const userData = sessionStorage.getItem("userData");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

export const supportPages = ["/approveLoan", "/settings"];

export const borrowerPages = [
  "/account",
  "/addLoan",
  "/myLoans",
  "/addFunds",
  "/retireFunds",
  "/settings",
  "/myTransactions",
];

const defaultSupport = "/approveLoan";
const defaultBorrower = "/myLoans";
const defaultLender = "/addInvestments";

export const lenderPages = [
  "/account",
  "/addInvestments",
  "/addFunds",
  "/retireFunds",
  "/myInvestments",
  "/myTransactions",
  "/settings",
];

export const authUserQuery = graphql`
  query RoutesQuery {
    user {
      id
      accountAvailable
      accountTotal
    }
    authUser {
      id
      name
      apellidoPaterno
      apellidoMaterno
      RFC
      CURP
      clabe
      mobile
      isLender
      isBorrower
      isSupport
      language
      email
    }
  }
`;

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
          const page = import("pages/LogIn/LogIn");
          return defer({ page });
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
          const page = import("pages/SignUp/SignUp");
          return defer({ page });
        },
      },
      {
        path: "/settings",
        element: <AccountLoader />,
        loader: async () => {
          const page = import("pages/Settings/Settings");
          const query = loadQuery(
            RelayEnvironment,
            SettingsAuthUserQuery,
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
          const page = import("pages/Account/Account");
          const query = loadQuery(
            RelayEnvironment,
            AccountUserQuery,
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
          const page = import("pages/MyTransactions/MyTransactions");
          const query = loadQuery(
            RelayEnvironment,
            MyTransactionsQuery,
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
          const page = import("pages/AddFunds/AddFunds");
          return defer({ page });
        },
      },
      {
        path: "/retireFunds",
        element: <RetireFundsLoader />,
        loader: async () => {
          const page = import("pages/RetireFunds/RetireFunds");
          return defer({ page });
        },
      },
      {
        path: "/addInvestments",
        element: <AddInvestmentsLoader />,
        loader: async () => {
          const page = import("pages/AddInvestments/AddInvestments");
          const query = loadQuery(
            RelayEnvironment,
            AddInvestmentsQuery,
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
          const page = import("pages/AddLoan/AddLoan");
          return defer({ page });
        },
      },
      {
        path: "/approveLoan",
        element: <ApproveLoanLoader />,
        loader: async () => {
          const page = import("pages/ApproveLoan/ApproveLoan");
          const query = loadQuery(
            RelayEnvironment,
            ApproveLoansQuery,
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
          const page = import("pages/MyLoans/MyLoans");
          const query = loadQuery(
            RelayEnvironment,
            MyLoansQuery,
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
          const page = import("pages/MyInvestments/MyInvestments");
          const query = loadQuery(
            RelayEnvironment,
            MyInvestmentsQuery,
            {},
            { fetchPolicy: "network-only" }
          );
          return defer({ page, query });
        },
      },
    ],
  },
]);
