import { type EntryPointComponent, RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import type { OperationType } from "relay-runtime";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { AccountPage } from "../../../fintechSrc/screens/Account/AccountPage";
import type { AccountQueriesQuery } from "../../../fintechSrc/screens/Account/__generated__/AccountQueriesQuery.graphql";
import type { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { authUserQuery } from "../../utilsAuth";

export interface Queries {
  [key: string]: OperationType;
  fintechQuery: AccountQueriesQuery;
  authQuery: utilsAuthQuery;
}

export const Account: EntryPointComponent<Queries, Record<string, undefined>> = (props) => {
  const { authUser } = usePreloadedQuery(authUserQuery, props.queries.authQuery);

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isSupport) {
    return <RedirectContainer allowed={["lender", "borrower"]} isBorrower={isBorrower} isLender={isLender} isSupport={isSupport} />;
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <AccountPage fintechQuery={props.queries.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default Account;
