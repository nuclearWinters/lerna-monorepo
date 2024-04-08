import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type AddLoan from "./AddLoan";
import utilsQueryParameters from "../../__generated__/utilsQuery$parameters";

export const AddLoanEntryPoint: SimpleEntryPoint<typeof AddLoan> = {
  root: JSResource("AddLoan", () => import("./AddLoan")),
  getPreloadProps() {
    return {
      queries: {
        authQuery: {
          parameters: utilsQueryParameters,
          variables: {},
        },
      },
    };
  },
};
