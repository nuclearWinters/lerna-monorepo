import type { EntryPoint } from "react-relay";
import utilsAuthQueryParamenters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import utilsFintechQueryParamenters from "../../../fintechSrc/__generated__/utilsFintechQuery$parameters";
import JSResource from "../../../react-router-elements/JSResource";
import type HeaderAuth from "./HeaderAuth";

export const HeaderAuthEntryPoint: EntryPoint<typeof HeaderAuth> = {
  root: JSResource("HeaderAuth", () => import("./HeaderAuth")),
  getPreloadProps() {
    return {
      queries: {
        authQuery: {
          parameters: utilsAuthQueryParamenters,
          environmentProviderOptions: {
            environment: "auth",
          },
          variables: {},
        },
        fintechQuery: {
          parameters: utilsFintechQueryParamenters,
          environmentProviderOptions: {
            environment: "fintech",
          },
          variables: {},
        },
      },
    };
  },
};
