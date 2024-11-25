import type { EntryPoint } from "react-relay";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import AccountQueriesQueryParameters from "../../../fintechSrc/screens/Account/__generated__/AccountQueriesQuery$parameters";
import JSResource from "../../../react-router-elements/JSResource";
import type Account from "./Account";

export const AccountEntryPoint: EntryPoint<typeof Account> = {
  root: JSResource("Account", () => import("./Account")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: AccountQueriesQueryParameters,
          environmentProviderOptions: {
            environment: "fintech",
          },
          variables: {},
        },
        authQuery: {
          parameters: utilsAuthQueryParameters,
          environmentProviderOptions: {
            environment: "auth",
          },
          variables: {},
        },
      },
    };
  },
};
