import type AddFunds from "./AddFunds";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";
import { JSResource } from "../../../react-router-entrypoints/JSResource";

export const AddFundsEntryPoint: CustomSimpleEntryPoint<typeof AddFunds> = {
  root: JSResource("AddFunds", () => import("./AddFunds")),
  getPreloadProps() {
    return {
      queries: {
        authQuery: {
          parameters: utilsAuthQueryParameters,
          environment: "auth",
          variables: {},
        },
      },
    };
  },
};
