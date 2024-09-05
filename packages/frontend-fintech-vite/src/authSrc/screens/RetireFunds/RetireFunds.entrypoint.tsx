import type RetireFunds from "./RetireFunds";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import JSResource from "../../../react-router-elements/JSResource";
import { EntryPoint } from "react-relay";

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
