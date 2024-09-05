import type AddInvestments from "./AddInvestments";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import AddInvestmentsQueriesQueryParameters from "../../../fintechSrc/screens/AddInvestments/__generated__/AddInvestmentsQueriesQuery$parameters";
import { EntryPoint } from "react-relay";
import JSResource from "../../../react-router-elements/JSResource";

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
