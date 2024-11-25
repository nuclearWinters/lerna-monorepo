import { type EntryPointComponent, RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import type { OperationType } from "relay-runtime";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { ApproveLoansPage } from "../../../fintechSrc/screens/ApproveLoan/ApproveLoanPage";
import type { ApproveLoanQueriesQuery } from "../../../fintechSrc/screens/ApproveLoan/__generated__/ApproveLoanQueriesQuery.graphql";
import type { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { authUserQuery } from "../../utilsAuth";

export interface Queries {
  [key: string]: OperationType;
  fintechQuery: ApproveLoanQueriesQuery;
  authQuery: utilsAuthQuery;
}

export const ApproveLoans: EntryPointComponent<Queries, Record<string, undefined>> = (props) => {
  const { authUser } = usePreloadedQuery(authUserQuery, props.queries.authQuery);

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isLender || isBorrower) {
    return <RedirectContainer allowed={["support"]} isBorrower={isBorrower} isLender={isLender} isSupport={isSupport} />;
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <ApproveLoansPage fintechQuery={props.queries.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default ApproveLoans;
