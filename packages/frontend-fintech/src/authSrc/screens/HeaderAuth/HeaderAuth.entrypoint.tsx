import { type CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";

import type HeaderAuth from "./HeaderAuth";
import utilsAuthQueryParamenters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import utilsFintechQueryParamenters from "../../../fintechSrc/__generated__/utilsFintechQuery$parameters";
import { JSResource } from "../../../react-router-entrypoints/JSResource";

export const HeaderAuthEntryPoint: CustomSimpleEntryPoint<typeof HeaderAuth> = {
  root: JSResource("HeaderAuth", () => import("./HeaderAuth")),
  getPreloadProps() {
    return {
      queries: {
        authQuery: {
          parameters: utilsAuthQueryParamenters,
          environment: "auth",
          variables: {},
        },
        fintechQuery: {
          parameters: utilsFintechQueryParamenters,
          environment: "fintech",
          variables: {},
        },
      },
    };
  },
};
