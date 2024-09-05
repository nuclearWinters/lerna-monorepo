import {
  EntryPointComponent,
  RelayEnvironmentProvider,
  usePreloadedQuery,
} from "react-relay/hooks";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { AccountPage } from "../../../fintechSrc/screens/Account/AccountPage";
import { AccountQueriesQuery } from "../../../fintechSrc/screens/Account/__generated__/AccountQueriesQuery.graphql";
import { authUserQuery } from "../../utilsAuth";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";

export type Queries = {
  fintechQuery: AccountQueriesQuery;
  authQuery: utilsAuthQuery;
};

export const Account: EntryPointComponent<Queries, {}> = (props) => {
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.queries.authQuery
  );

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isSupport) {
    return (
      <RedirectContainer
        allowed={["lender", "borrower"]}
        isBorrower={isBorrower}
        isLender={isLender}
        isSupport={isSupport}
      />
    );
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <AccountPage fintechQuery={props.queries.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default Account;
