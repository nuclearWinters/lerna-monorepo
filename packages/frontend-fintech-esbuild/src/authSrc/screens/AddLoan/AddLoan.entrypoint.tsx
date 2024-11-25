import type { EntryPoint } from "react-relay";
import JSResource from "../../../react-router-elements/JSResource";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import type AddLoan from "./AddLoan";

export const AddLoanEntryPoint: EntryPoint<typeof AddLoan> = {
  root: JSResource("AddLoan", () => import("./AddLoan")),
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
