import {
  type SimpleEntryPoint,
  JSResource,
} from "@loop-payments/react-router-relay";

import type HeaderAuth from "./HeaderAuth";
import utilsQueryParamenters from "../../__generated__/utilsQuery$parameters";

export const HeaderAuthEntryPoint: SimpleEntryPoint<typeof HeaderAuth> = {
  root: JSResource("HeaderAuth", () => import("./HeaderAuth")),
  getPreloadProps() {
    return {
      queries: {
        authQuery: {
          parameters: utilsQueryParamenters,
          variables: {},
        },
      },
    };
  },
};
