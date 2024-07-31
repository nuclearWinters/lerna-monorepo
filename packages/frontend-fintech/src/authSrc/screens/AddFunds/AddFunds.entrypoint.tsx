import type AddFunds from "./AddFunds";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import { JSResource, SimpleEntryPoint } from "../../../react-router-relay";

export const AddFundsEntryPoint: SimpleEntryPoint<typeof AddFunds> = {
  root: JSResource("AddFunds", () => import("./AddFunds")),
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
