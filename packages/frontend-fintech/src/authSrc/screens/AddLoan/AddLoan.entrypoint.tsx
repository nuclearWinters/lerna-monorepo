import type AddLoan from "./AddLoan";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import { JSResource } from "../../../react-router-entrypoints/JSResource";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";

export const AddLoanEntryPoint: CustomSimpleEntryPoint<typeof AddLoan> = {
  root: JSResource("AddLoan", () => import("./AddLoan")),
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
