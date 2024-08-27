import { JSResource } from "../../../react-router-entrypoints/JSResource";

import type MyInvestments from "./MyInvestments";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import MyInvestmentsQueriesQueryParamenters from "../../../fintechSrc/screens/MyInvestments/__generated__/MyInvestmentsQueriesQuery$parameters";
import { CustomSimpleEntryPoint } from "../../../react-router-entrypoints/createRouter";

export const MyInvestmentsEntryPoint: CustomSimpleEntryPoint<
  typeof MyInvestments
> = {
  root: JSResource("MyInvestments", () => import("./MyInvestments")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: MyInvestmentsQueriesQueryParamenters,
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
