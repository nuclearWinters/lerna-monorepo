import type AddInvestments from "./AddInvestments";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import AddInvestmentsQueriesQueryParameters from "../../../fintechSrc/screens/AddInvestments/__generated__/AddInvestmentsQueriesQuery$parameters";
import { JSResource, SimpleEntryPoint } from "../../../react-router-relay";

export const AddInvestmentsEntryPoint: SimpleEntryPoint<typeof AddInvestments> =
  {
    root: JSResource("AddInvestments", () => import("./AddInvestments")),
    getPreloadProps() {
      return {
        queries: {
          fintechQuery: {
            parameters: AddInvestmentsQueriesQueryParameters,
            environmentProviderOptions: {
              enviroment: "fintech",
            },
            variables: {},
          },
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
