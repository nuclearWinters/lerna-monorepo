import type ApproveLoan from "./ApproveLoan";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import ApproveLoanQueriesQueryParamenters from "../../../fintechSrc/screens/ApproveLoan/__generated__/ApproveLoanQueriesQuery$parameters";
import { JSResource, SimpleEntryPoint } from "../../../react-router-relay";

export const ApproveLoanEntryPoint: SimpleEntryPoint<typeof ApproveLoan> = {
  root: JSResource("ApproveLoan", () => import("./ApproveLoan")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: ApproveLoanQueriesQueryParamenters,
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
