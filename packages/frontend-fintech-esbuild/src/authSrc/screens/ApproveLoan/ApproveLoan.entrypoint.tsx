import type { EntryPoint } from "react-relay";
import ApproveLoanQueriesQueryParamenters from "../../../fintechSrc/screens/ApproveLoan/__generated__/ApproveLoanQueriesQuery$parameters";
import JSResource from "../../../react-router-elements/JSResource";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import type ApproveLoan from "./ApproveLoan";

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
