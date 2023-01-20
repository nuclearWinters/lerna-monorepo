import { loadQuery, PreloadedQuery } from "react-relay/hooks";
import { RelayEnvironment } from "RelayEnvironment";
import SettingsAuthUserQuery from "./screens/__generated__/SettingsAuthUserQuery.graphql";
import AccountUserQuery from "./screens/__generated__/AccountUserQuery.graphql";
import MyInvestmentsUserQuery from "./screens/__generated__/MyInvestmentsUserQuery.graphql";
import MyTransactionsQuery from "./screens/__generated__/MyTransactionsQuery.graphql";
import AddInvestmentsQuery from "./screens/__generated__/AddInvestmentsQuery.graphql";
import MyLoansQuery from "./screens/__generated__/MyLoansQuery.graphql";
import { RouteConfig } from "yarr";
import { tokensAndData } from "App";
import { Decode } from "./screens/LogIn";
import decode from "jwt-decode";

export type IRouteConfig = RouteConfig<
  string,
  string,
  {
    params: {};
    search: {};
    preloaded: { query: PreloadedQuery<any>; id?: string };
  }
>[];

export const routes: IRouteConfig = [
  {
    component: async () => {
      const module = await import("./screens/LogIn");
      return module.LogIn;
    },
    path: "/login",
  },
  {
    component: async () => {
      const module = await import("./screens/SignUp");
      return module.SignUp;
    },
    path: "/register",
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
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data?.isSupport) {
          return "/login";
        }
        return null;
      }
      return "/login";
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
      if (tokensAndData.accessToken) {
        return null;
      }
      return "/login";
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
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (!data?.isLender) {
          return "/login";
        }
        return null;
      }
      return "/login";
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
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (!(data?.isLender || data.isBorrower)) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/AddFunds");
      return module.AddFunds;
    },
    path: "/addFunds",
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data?.isSupport) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/RetireFunds");
      return module.RetireFunds;
    },
    path: "/retireFunds",
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data?.isSupport) {
          return "/login";
        }
        return null;
      }
      return "/login";
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
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data?.isSupport || data?.isBorrower) {
          return "/login";
        }
        return null;
      }
      return null;
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
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (!data?.isSupport) {
          return "/login";
        }
        return null;
      }
      return "/login";
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
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (!data?.isBorrower) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/AddLoan");
      return module.AddLoan;
    },
    path: "/addLoan",
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (!data?.isBorrower) {
          return "/login";
        }
        return null;
      }
      return "/login";
    },
  },
  {
    component: async () => {
      const module = await import("./screens/LogIn");
      return module.LogIn;
    },
    path: "/",
    redirectRules: () => {
      if (tokensAndData.accessToken) {
        const data = decode<Decode>(tokensAndData.accessToken);
        if (data?.isBorrower) {
          return "/myLoans";
        } else if (data?.isLender) {
          return "/addInvestments";
        } else {
          return "/myLoans";
        }
      }
      return "/login";
    },
  },
];
