import type AddLoan from "./AddLoan";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import { JSResource, SimpleEntryPoint } from "../../../react-router-relay";

export const AddLoanEntryPoint: SimpleEntryPoint<typeof AddLoan> = {
  root: JSResource("AddLoan", () => import("./AddLoan")),
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
