import type ApproveLoan from "./ApproveLoan";
import utilsAuthQueryParameters from "../../__generated__/utilsAuthQuery$parameters";
import ApproveLoanQueriesQueryParamenters from "../../../fintechSrc/screens/ApproveLoan/__generated__/ApproveLoanQueriesQuery$parameters";
import { JSResource } from "../../../react-router-entrypoints/JSResource";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";

export const ApproveLoanEntryPoint: CustomSimpleEntryPoint<typeof ApproveLoan> =
  {
    root: JSResource("ApproveLoan", () => import("./ApproveLoan")),
    getPreloadProps() {
      return {
        queries: {
          fintechQuery: {
            parameters: ApproveLoanQueriesQueryParamenters,
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
