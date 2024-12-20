import { type EntryPointComponent, RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import type { OperationType } from "relay-runtime";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import type { utilsAuthQuery } from "../../../authSrc/__generated__/utilsAuthQuery.graphql";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { AddInvestmentsPage } from "../../../fintechSrc/screens/AddInvestments/AddInvestmentsPage";
import type { AddInvestmentsQueriesQuery } from "../../../fintechSrc/screens/AddInvestments/__generated__/AddInvestmentsQueriesQuery.graphql";
import { authUserQuery } from "../../utilsAuth";

export interface Queries {
  [key: string]: OperationType;
  fintechQuery: AddInvestmentsQueriesQuery;
  authQuery: utilsAuthQuery;
}

export const AddInvestments: EntryPointComponent<Queries, Record<string, undefined>> = (props) => {
  const { authUser } = usePreloadedQuery(authUserQuery, props.queries.authQuery);

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isBorrower || isSupport) {
    return <RedirectContainer allowed={["lender"]} isBorrower={isBorrower} isLender={isLender} isSupport={isSupport} />;
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <AddInvestmentsPage fintechQuery={props.queries.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default AddInvestments;
