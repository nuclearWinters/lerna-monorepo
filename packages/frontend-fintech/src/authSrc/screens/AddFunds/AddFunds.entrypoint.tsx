import type AddFunds from "./AddFunds";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import { EntryPoint } from "react-relay";
import JSResource from "../../../react-router-elements/JSResource";

export const AddFundsEntryPoint: EntryPoint<typeof AddFunds> = {
  root: JSResource("AddFunds", () => import("./AddFunds")),
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
