import { loadQuery, PreloadedQuery } from "react-relay/hooks";
import { RelayEnvironment } from "RelayEnvironment";
import SettingsAuthUserQuery from "./screens/__generated__/SettingsAuthUserQuery.graphql";
import AccountUserQuery from "./screens/__generated__/AccountUserQuery.graphql";
import MyInvestmentsUserQuery from "./screens/__generated__/MyInvestmentsUserQuery.graphql";
import MyTransactionsQuery from "./screens/__generated__/MyTransactionsQuery.graphql";
import AddInvestmentsQuery from "./screens/__generated__/AddInvestmentsQuery.graphql";
import MyLoansQuery from "./screens/__generated__/MyLoansQuery.graphql";
import { RouteConfig } from "yarr";
import { Decode } from "./screens/LogIn";

export type IRouteConfig = RouteConfig<
  string,
  string,
  {
    params: {};
    search: {};
    preloaded: { query: PreloadedQuery<any>; id?: string };
  }
>[];

export const getUserDataCache = (): Decode | null => {
  const userData = sessionStorage.getItem("userData");
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

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

export const routes: IRouteConfig = [
  {
    component: async () => {
      const module = await import("./screens/LogIn");
      return module.LogIn;
    },
    path: "/login",
    redirectRules: () => {
      const data = getUserDataCache();
      if (data?.isBorrower) {
        return defaultBorrower;
      }
      if (data?.isSupport) {
        return defaultSupport;
      }
      if (data?.isLender) {
        return defaultSupport;
      }
      return null;
    },
  },
  {
    component: async () => {
      const module = await import("./screens/SignUp");
      return module.SignUp;
    },
    path: "/register",
    redirectRules: () => {
      const data = getUserDataCache();
      if (data?.isBorrower) {
        return defaultBorrower;
      }
      if (data?.isSupport) {
        return defaultSupport;
      }
      if (data?.isLender) {
        return defaultSupport;
      }
      return null;
    },
  },
  {
    component: async () => {
      const module = await import("./screens/Account");
      return module.Account;
    },
    path: "/account",
    preload: () => ({
      query: loadQuery(RelayEnvironment, AccountUserQuery, {}),
    }),
    redirectRules: () => {
      const data = getUserDataCache();
      if (!data) {
        return "/login?redirectTo=account";
      }
      if (data?.isSupport) {
        return defaultSupport;
      }
      return null;
    },
  },
  {
    component: async () => {
      const module = await import("./screens/Settings");
      return module.Settings;
    },
    path: "/settings",
    preload: () => ({
      query: loadQuery(RelayEnvironment, SettingsAuthUserQuery, {}),
    }),
    redirectRules: () => {
      const data = getUserDataCache();
      if (!data) {
        return "/login?redirectTo=settings";
      }
      return null;
    },
  },
  {
    component: async () => {
      const module = await import("./screens/MyInvestments");
      return module.MyInvestments;
    },
    path: "/myInvestments",
    preload: () => {
      return {
        query: loadQuery(
          RelayEnvironment,
          MyInvestmentsUserQuery,
          {},
          { fetchPolicy: "network-only" }
        ),
      };
    },
    redirectRules: () => {
      const data = getUserDataCache();
      if (!data) {
        return "/login?redirectTo=myInvestments";
      }
      if (data.isBorrower) {
        return defaultBorrower;
      }
      if (data.isSupport) {
        return defaultSupport;
      }
      return null;
    },
  },
  {
    component: async () => {
      const module = await import("./screens/MyTransactions");
      return module.MyTransactions;
    },
    path: "/myTransactions",
    preload: () => {
      return {
        query: loadQuery(
          RelayEnvironment,
          MyTransactionsQuery,
          {},
          { fetchPolicy: "network-only" }
        ),
      };
    },
    redirectRules: () => {
      const data = getUserDataCache();
      if (!data) {
        return "/login?redirectTo=myTransactions";
      }
      if (data.isSupport) {
        return defaultSupport;
      }
      return null;
    },
  },
  {
    component: async () => {
      const module = await import("./screens/AddFunds");
      return module.AddFunds;
    },
    path: "/addFunds",
    redirectRules: () => {
      const data = getUserDataCache();
      if (!data) {
        return "/login?redirectTo=addFunds";
      }
      if (data.isSupport) {
        return defaultSupport;
      }
      return null;
    },
  },
  {
    component: async () => {
      const module = await import("./screens/RetireFunds");
      return module.RetireFunds;
    },
    path: "/retireFunds",
    redirectRules: () => {
      return redirectPage(["lender", "borrower"], "/retireFunds");
    },
  },
  {
    component: async () => {
      const module = await import("./screens/AddInvestments");
      return module.AddInvestments;
    },
    path: "/addInvestments",
    preload: () => ({
      query: loadQuery(RelayEnvironment, AddInvestmentsQuery, {}),
    }),
    redirectRules: () => {
      return redirectPage(["lender"], "/addInvestments");
    },
  },
  {
    component: async () => {
      const module = await import("./screens/MyLoans");
      return module.MyLoans;
    },
    path: "/approveLoan",
    preload: () => ({
      query: loadQuery(RelayEnvironment, MyLoansQuery, {}),
    }),
    redirectRules: () => {
      return redirectPage(["support"], "/approveLoan");
    },
  },
  {
    component: async () => {
      const module = await import("./screens/MyLoans");
      return module.MyLoans;
    },
    path: "/myLoans",
    preload: () => ({
      query: loadQuery(RelayEnvironment, MyLoansQuery, {}),
    }),
    redirectRules: () => {
      return redirectPage(["borrower"], "/myLoans");
    },
  },
  {
    component: async () => {
      const module = await import("./screens/AddLoan");
      return module.AddLoan;
    },
    path: "/addLoan",
    redirectRules: () => {
      return redirectPage(["borrower"], "/addLoan");
    },
  },
  {
    component: async () => {
      const module = await import("./screens/Blank");
      return module.Blank;
    },
    path: "/",
    redirectRules: () => {
      const data = getUserDataCache();
      if (data?.isBorrower) {
        return defaultBorrower;
      }
      if (data?.isSupport) {
        return defaultSupport;
      }
      if (data?.isLender) {
        return defaultSupport;
      }
      return "/login";
    },
  },
];
