import type ApproveLoan from "./ApproveLoan";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import ApproveLoanQueriesQueryParamenters from "../../../fintechSrc/screens/ApproveLoan/__generated__/ApproveLoanQueriesQuery$parameters";
import JSResource from "../../../react-router-elements/JSResource";
import { EntryPoint } from "react-relay";

export const ApproveLoanEntryPoint: EntryPoint<typeof ApproveLoan> = {
  root: JSResource("ApproveLoan", () => import("./ApproveLoan")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: ApproveLoanQueriesQueryParamenters,
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
