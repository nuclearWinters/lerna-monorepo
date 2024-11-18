import type { EntryPoint } from "react-relay";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import AddInvestmentsQueriesQueryParameters from "../../../fintechSrc/screens/AddInvestments/__generated__/AddInvestmentsQueriesQuery$parameters";
import JSResource from "../../../react-router-elements/JSResource";
import type AddInvestments from "./AddInvestments";

export const AddInvestmentsEntryPoint: EntryPoint<typeof AddInvestments> = {
  root: JSResource("AddInvestments", () => import("./AddInvestments")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: AddInvestmentsQueriesQueryParameters,
          environmentProviderOptions: {
            environment: "fintech",
          },
          variables: {},
        },
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
