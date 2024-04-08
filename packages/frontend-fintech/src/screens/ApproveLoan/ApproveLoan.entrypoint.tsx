import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type ApproveLoan from "./ApproveLoan";
import utilsQueryParameters from "../../__generated__/utilsQuery$parameters";
import ApproveLoanQueriesQueryParamenters from "./__generated__/ApproveLoanQueriesQuery$parameters";

export const ApproveLoanEntryPoint: SimpleEntryPoint<typeof ApproveLoan> = {
  root: JSResource("ApproveLoan", () => import("./ApproveLoan")),
  getPreloadProps() {
    return {
      queries: {
        query: {
          parameters: ApproveLoanQueriesQueryParamenters,
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
