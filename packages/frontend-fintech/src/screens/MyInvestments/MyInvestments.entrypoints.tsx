import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type MyInvestments from "./MyInvestments";
import utilsQueryParameters from "../../__generated__/utilsQuery$parameters";
import MyInvestmentsQueriesQueryParamenters from "./__generated__/MyInvestmentsQueriesQuery$parameters";

export const MyInvestmentsEntryPoint: SimpleEntryPoint<typeof MyInvestments> = {
  root: JSResource("MyInvestments", () => import("./MyInvestments")),
  getPreloadProps() {
    return {
      queries: {
        query: {
          parameters: MyInvestmentsQueriesQueryParamenters,
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
