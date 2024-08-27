import { FC } from "react";
import { RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { AccountPage } from "../../../fintechSrc/screens/Account/AccountPage";
import { AccountQueriesQuery } from "../../../fintechSrc/screens/Account/__generated__/AccountQueriesQuery.graphql";
import { authUserQuery } from "../../utilsAuth";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import {
  EntryPointPrepared,
  EntryPointProps,
} from "../../../react-router-entrypoints/types";

export type Queries = {
  fintechQuery: AccountQueriesQuery;
  authQuery: utilsAuthQuery;
};

export type PreparedProps = EntryPointPrepared<Queries>;

export type Props = EntryPointProps<Queries>;

export const Account: FC<Props> = (props) => {
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.prepared.authQuery
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
      <AccountPage fintechQuery={props.prepared.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default Account;
