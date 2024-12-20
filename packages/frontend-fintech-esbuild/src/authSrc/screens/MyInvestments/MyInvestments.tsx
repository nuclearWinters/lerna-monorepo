import { type EntryPointComponent, RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import type { OperationType } from "relay-runtime";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { MyInvestmentsPage } from "../../../fintechSrc/screens/MyInvestments/MyInvestmentsPage";
import type { MyInvestmentsQueriesQuery } from "../../../fintechSrc/screens/MyInvestments/__generated__/MyInvestmentsQueriesQuery.graphql";
import type { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { authUserQuery } from "../../utilsAuth";

export interface Queries {
  [key: string]: OperationType;
  fintechQuery: MyInvestmentsQueriesQuery;
  authQuery: utilsAuthQuery;
}

export const MyInvestments: EntryPointComponent<Queries, Record<string, undefined>> = (props) => {
  const { authUser } = usePreloadedQuery(authUserQuery, props.queries.authQuery);

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isSupport || isBorrower) {
    return <RedirectContainer allowed={["lender"]} isBorrower={isBorrower} isLender={isLender} isSupport={isSupport} />;
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <MyInvestmentsPage fintechQuery={props.queries.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default MyInvestments;
