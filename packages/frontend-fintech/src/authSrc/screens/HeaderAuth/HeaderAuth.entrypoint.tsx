import { type SimpleEntryPoint, JSResource } from "../../../react-router-relay";

import type HeaderAuth from "./HeaderAuth";
import utilsAuthQueryParamenters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import utilsFintechQueryParamenters from "../../../fintechSrc/__generated__/utilsFintechQuery$parameters";

export const HeaderAuthEntryPoint: SimpleEntryPoint<typeof HeaderAuth> = {
  root: JSResource("HeaderAuth", () => import("./HeaderAuth")),
  getPreloadProps() {
    return {
      queries: {
        authQuery: {
          parameters: utilsAuthQueryParamenters,
          environmentProviderOptions: {
            enviroment: "auth",
          },
          variables: {},
        },
        fintechQuery: {
          parameters: utilsFintechQueryParamenters,
          environmentProviderOptions: {
            enviroment: "fintech",
          },
          variables: {},
        },
      },
    };
  },
};
