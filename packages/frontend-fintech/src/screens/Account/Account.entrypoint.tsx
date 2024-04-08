import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type Account from "./Account";
import utilsQueryParameters from "../../__generated__/utilsQuery$parameters";
import AccountQueriesQueryParameters from "./__generated__/AccountQueriesQuery$parameters";

export const AccountEntryPoint: SimpleEntryPoint<typeof Account> = {
  root: JSResource("Account", () => import("./Account")),
  getPreloadProps() {
    return {
      queries: {
        query: {
          parameters: AccountQueriesQueryParameters,
          variables: {},
        },
        authQuery: {
          parameters: utilsQueryParameters,
          variables: {},
        },
      },
    };
  },
};
