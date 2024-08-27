import { FC } from "react";
import { RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import { utilsAuthQuery } from "../../../authSrc/__generated__/utilsAuthQuery.graphql";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { AddInvestmentsPage } from "../../../fintechSrc/screens/AddInvestments/AddInvestmentsPage";
import { AddInvestmentsQueriesQuery } from "../../../fintechSrc/screens/AddInvestments/__generated__/AddInvestmentsQueriesQuery.graphql";
import { authUserQuery } from "../../utilsAuth";
import {
  EntryPointPrepared,
  EntryPointProps,
} from "../../../react-router-entrypoints/types";

export type Queries = {
  fintechQuery: AddInvestmentsQueriesQuery;
  authQuery: utilsAuthQuery;
};

export type PreparedProps = EntryPointPrepared<Queries>;

export type Props = EntryPointProps<Queries>;

export const AddInvestments: FC<Props> = (props) => {
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.prepared.authQuery
  );

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isBorrower || isSupport) {
    return (
      <RedirectContainer
        allowed={["lender"]}
        isBorrower={isBorrower}
        isLender={isLender}
        isSupport={isSupport}
      />
    );
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <AddInvestmentsPage fintechQuery={props.prepared.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default AddInvestments;
