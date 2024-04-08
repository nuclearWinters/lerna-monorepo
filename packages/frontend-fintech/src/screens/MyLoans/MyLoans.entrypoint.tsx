import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type MyLoans from "./MyLoans";
import utilsQueryParameters from "../../__generated__/utilsQuery$parameters";
import MyLoansQueriesQueryParamenters from "./__generated__/MyLoansQueriesQuery$parameters";

export const MyLoansEntryPoint: SimpleEntryPoint<typeof MyLoans> = {
  root: JSResource("MyLoans", () => import("./MyLoans")),
  getPreloadProps() {
    return {
      queries: {
        query: {
          parameters: MyLoansQueriesQueryParamenters,
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
