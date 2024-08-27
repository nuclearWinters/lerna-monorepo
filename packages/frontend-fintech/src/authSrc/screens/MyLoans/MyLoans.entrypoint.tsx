import { JSResource } from "../../../react-router-entrypoints/JSResource";

import type MyLoans from "./MyLoans";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import MyLoansQueriesQueryParamenters from "../../../fintechSrc/screens/MyLoans/__generated__/MyLoansQueriesQuery$parameters";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";

export const MyLoansEntryPoint: CustomSimpleEntryPoint<typeof MyLoans> = {
  root: JSResource("MyLoans", () => import("./MyLoans")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: MyLoansQueriesQueryParamenters,
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
