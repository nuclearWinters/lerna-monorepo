import {
  EntryPointComponent,
  RelayEnvironmentProvider,
  usePreloadedQuery,
} from "react-relay/hooks";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { ApproveLoansPage } from "../../../fintechSrc/screens/ApproveLoan/ApproveLoanPage";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { ApproveLoanQueriesQuery } from "../../../fintechSrc/screens/ApproveLoan/__generated__/ApproveLoanQueriesQuery.graphql";
import { authUserQuery } from "../../utilsAuth";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";

export type Queries = {
  fintechQuery: ApproveLoanQueriesQuery;
  authQuery: utilsAuthQuery;
};

export const ApproveLoans: EntryPointComponent<Queries, {}> = (props) => {
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.queries.authQuery
  );

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isLender || isBorrower) {
    return (
      <RedirectContainer
        allowed={["support"]}
        isBorrower={isBorrower}
        isLender={isLender}
        isSupport={isSupport}
      />
    );
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <ApproveLoansPage fintechQuery={props.queries.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default ApproveLoans;
