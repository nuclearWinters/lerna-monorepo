import type Account from "./Account";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import AccountQueriesQueryParameters from "../../../fintechSrc/screens/Account/__generated__/AccountQueriesQuery$parameters";
import { JSResource, SimpleEntryPoint } from "../../../react-router-relay";

export const AccountEntryPoint: SimpleEntryPoint<typeof Account> = {
  root: JSResource("Account", () => import("./Account")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: AccountQueriesQueryParameters,
          environmentProviderOptions: {
            enviroment: "fintech",
          },
          variables: {},
        },
        authQuery: {
          parameters: utilsAuthQueryParameters,
          environmentProviderOptions: {
            enviroment: "auth",
          },
          variables: {},
        },
      },
    };
  },
};
