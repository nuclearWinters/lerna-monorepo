import type MyTransactions from "./MyTransactions";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import MyTransactionsQueriesQueryParamenters from "../../../fintechSrc/screens/MyTransactions/__generated__/MyTransactionsQueriesQuery$parameters";
import { EntryPoint } from "react-relay";
import JSResource from "../../../react-router-elements/JSResource";

export const MyTransactionsEntryPoint: EntryPoint<typeof MyTransactions> = {
  root: JSResource("MyTransactions", () => import("./MyTransactions")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: MyTransactionsQueriesQueryParamenters,
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
