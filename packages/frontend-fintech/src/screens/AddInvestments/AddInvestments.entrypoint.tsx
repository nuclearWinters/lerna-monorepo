import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type AddInvestments from "./AddInvestments";
import utilsQueryParameters from "../../__generated__/utilsQuery$parameters";
import AddInvestmentsQueriesQueryParameters from "./__generated__/AddInvestmentsQueriesQuery$parameters";

export const AddInvestmentsEntryPoint: SimpleEntryPoint<typeof AddInvestments> =
  {
    root: JSResource("AddInvestments", () => import("./AddInvestments")),
    getPreloadProps() {
      return {
        queries: {
          query: {
            parameters: AddInvestmentsQueriesQueryParameters,
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
