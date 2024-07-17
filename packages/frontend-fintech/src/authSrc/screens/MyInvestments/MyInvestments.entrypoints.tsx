import { type SimpleEntryPoint, JSResource } from "../../../react-router-relay";

import type MyInvestments from "./MyInvestments";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import MyInvestmentsQueriesQueryParamenters from "../../../fintechSrc/screens/MyInvestments/__generated__/MyInvestmentsQueriesQuery$parameters";

export const MyInvestmentsEntryPoint: SimpleEntryPoint<typeof MyInvestments> = {
  root: JSResource("MyInvestments", () => import("./MyInvestments")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: MyInvestmentsQueriesQueryParamenters,
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
