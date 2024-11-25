import type { EntryPoint } from "react-relay";
import utilsAuthQueryParameters from "../../../authSrc/__generated__/utilsAuthQuery$parameters";
import MyLoansQueriesQueryParamenters from "../../../fintechSrc/screens/MyLoans/__generated__/MyLoansQueriesQuery$parameters";
import JSResource from "../../../react-router-elements/JSResource";
import type MyLoans from "./MyLoans";

export const MyLoansEntryPoint: EntryPoint<typeof MyLoans> = {
  root: JSResource("MyLoans", () => import("./MyLoans")),
  getPreloadProps() {
    return {
      queries: {
        fintechQuery: {
          parameters: MyLoansQueriesQueryParamenters,
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
