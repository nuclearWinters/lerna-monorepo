import type Account from "./Account";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import AccountQueriesQueryParameters from "../../../fintechSrc/screens/Account/__generated__/AccountQueriesQuery$parameters";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";
import { JSResource } from "../../../react-router-entrypoints/JSResource";

export const AccountEntryPoint: CustomSimpleEntryPoint<typeof Account> = {
  root: JSResource("Account", () => import("./Account")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: AccountQueriesQueryParameters,
          environment: "fintech",
          variables: {},
        },
        authQuery: {
          parameters: utilsAuthQueryParameters,
          environment: "auth",
          variables: {},
        },
      },
    };
  },
};
