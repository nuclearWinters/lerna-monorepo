import { type SimpleEntryPoint, JSResource } from "../../../react-router-relay";

import type MyTransactions from "./MyTransactions";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import MyTransactionsQueriesQueryParamenters from "../../../fintechSrc/screens/MyTransactions/__generated__/MyTransactionsQueriesQuery$parameters";

export const MyTransactionsEntryPoint: SimpleEntryPoint<typeof MyTransactions> =
  {
    root: JSResource("MyTransactions", () => import("./MyTransactions")),
    getPreloadProps() {
      return {
        queries: {
          fintechQuery: {
            parameters: MyTransactionsQueriesQueryParamenters,
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
