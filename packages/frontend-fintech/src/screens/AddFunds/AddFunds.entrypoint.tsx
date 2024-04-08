import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type AddFunds from "./AddFunds";
import utilsQueryParameters from "../../__generated__/utilsQuery$parameters";

export const AddFundsEntryPoint: SimpleEntryPoint<typeof AddFunds> = {
  root: JSResource("AddFunds", () => import("./AddFunds")),
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
