import { type SimpleEntryPoint, JSResource } from "../../../react-router-relay";

import type MyLoans from "./MyLoans";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import MyLoansQueriesQueryParamenters from "../../../fintechSrc/screens/MyLoans/__generated__/MyLoansQueriesQuery$parameters";

export const MyLoansEntryPoint: SimpleEntryPoint<typeof MyLoans> = {
  root: JSResource("MyLoans", () => import("./MyLoans")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: MyLoansQueriesQueryParamenters,
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
