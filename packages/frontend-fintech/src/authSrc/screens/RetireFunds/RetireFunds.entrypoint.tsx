import type { EntryPoint } from "react-relay";
import JSResource from "../../../react-router-elements/JSResource";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import type RetireFunds from "./RetireFunds";

export const RetireFundsEntryPoint: EntryPoint<typeof RetireFunds> = {
  root: JSResource("RetireFunds", () => import("./RetireFunds")),
  getPreloadProps() {
    return {
      queries: {
        authQuery: {
          parameters: utilsAuthQueryParameters,
          environmentProviderOptions: {
            environment: "auth",
          },
          variables: {},
        },
      },
    };
  },
};
