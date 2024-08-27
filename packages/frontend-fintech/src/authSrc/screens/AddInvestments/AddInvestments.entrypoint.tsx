import type AddInvestments from "./AddInvestments";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import AddInvestmentsQueriesQueryParameters from "../../../fintechSrc/screens/AddInvestments/__generated__/AddInvestmentsQueriesQuery$parameters";
import { JSResource } from "../../../react-router-entrypoints/JSResource";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";

export const AddInvestmentsEntryPoint: CustomSimpleEntryPoint<
  typeof AddInvestments
> = {
  root: JSResource("AddInvestments", () => import("./AddInvestments")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: AddInvestmentsQueriesQueryParameters,
          environment: "fintech",
          variables: {},
        },
        authQuery: {
          parameters: utilsAuthQueryParameters,
          environment: "auth",
          variables: {},
        },
      },
    };
  },
};
