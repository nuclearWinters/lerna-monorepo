import type HeaderAuth from "./HeaderAuth";
import utilsAuthQueryParamenters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import utilsFintechQueryParamenters from "../../../fintechSrc/__generated__/utilsFintechQuery$parameters";
import { EntryPoint } from "react-relay";
import JSResource from "../../../react-router-elements/JSResource";

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
