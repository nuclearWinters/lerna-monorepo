import type RetireFunds from "./RetireFunds";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import { JSResource, SimpleEntryPoint } from "../../../react-router-relay";

export const RetireFundsEntryPoint: SimpleEntryPoint<typeof RetireFunds> = {
  root: JSResource("RetireFunds", () => import("./RetireFunds")),
  getPreloadProps() {
    return {
      queries: {
        authQuery: {
          parameters: utilsAuthQueryParameters,
          environmentProviderOptions: {
            enviroment: "auth",
          },
          variables: {},
        },
      },
    };
  },
};
