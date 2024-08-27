import { JSResource } from "../../../react-router-entrypoints/JSResource";

import type MyTransactions from "./MyTransactions";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import MyTransactionsQueriesQueryParamenters from "../../../fintechSrc/screens/MyTransactions/__generated__/MyTransactionsQueriesQuery$parameters";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";

export const MyTransactionsEntryPoint: CustomSimpleEntryPoint<
  typeof MyTransactions
> = {
  root: JSResource("MyTransactions", () => import("./MyTransactions")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: MyTransactionsQueriesQueryParamenters,
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
