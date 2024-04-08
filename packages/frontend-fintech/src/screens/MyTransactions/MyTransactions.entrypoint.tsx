import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type MyTransactions from "./MyTransactions";
import utilsQueryParameters from "../../__generated__/utilsQuery$parameters";
import MyTransactionsQueriesQueryParamenters from "./__generated__/MyTransactionsQueriesQuery$parameters";

export const MyTransactionsEntryPoint: SimpleEntryPoint<typeof MyTransactions> =
  {
    root: JSResource("MyTransactions", () => import("./MyTransactions")),
    getPreloadProps() {
      return {
        queries: {
          query: {
            parameters: MyTransactionsQueriesQueryParamenters,
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
