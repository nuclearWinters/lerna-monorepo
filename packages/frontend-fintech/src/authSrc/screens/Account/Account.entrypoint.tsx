import type Account from "./Account";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import AccountQueriesQueryParameters from "../../../fintechSrc/screens/Account/__generated__/AccountQueriesQuery$parameters";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";
import { JSResource } from "../../../react-router-entrypoints/JSResource";

//Let this be inferred; delete the type
export const AccountEntryPoint: CustomSimpleEntryPoint<typeof Account> = {
  //Type JSResource as a function that returns the component
  root: JSResource("Account", () => import("./Account")),
  //Do not type this function; let it be inferred
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
