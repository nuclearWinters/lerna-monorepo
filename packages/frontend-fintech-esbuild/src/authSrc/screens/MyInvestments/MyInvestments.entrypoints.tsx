import type { EntryPoint } from "react-relay";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import MyInvestmentsQueriesQueryParamenters from "../../../fintechSrc/screens/MyInvestments/__generated__/MyInvestmentsQueriesQuery$parameters";
import JSResource from "../../../react-router-elements/JSResource";
import type MyInvestments from "./MyInvestments";

export const MyInvestmentsEntryPoint: EntryPoint<typeof MyInvestments> = {
  root: JSResource("MyInvestments", () => import("./MyInvestments")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: MyInvestmentsQueriesQueryParamenters,
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
