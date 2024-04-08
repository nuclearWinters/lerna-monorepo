import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type RetireFunds from "./RetireFunds";
import utilsQueryParameters from "../../__generated__/utilsQuery$parameters";

export const RetireFundsEntryPoint: SimpleEntryPoint<typeof RetireFunds> = {
  root: JSResource("RetireFunds", () => import("./RetireFunds")),
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
