import { FC } from "react";
import { RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import { utilsAuthQuery } from "../../../authSrc/__generated__/utilsAuthQuery.graphql";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { AddInvestmentsPage } from "../../../fintechSrc/screens/AddInvestments/AddInvestmentsPage";
import { AddInvestmentsQueriesQuery } from "../../../fintechSrc/screens/AddInvestments/__generated__/AddInvestmentsQueriesQuery.graphql";
import { authUserQuery } from "../../utilsAuth";
import { SimpleEntryPointProps } from "../../../react-router-relay";

type Props = SimpleEntryPointProps<{
  fintechQuery: AddInvestmentsQueriesQuery;
  authQuery: utilsAuthQuery;
}>;

export const AddInvestments: FC<Props> = (props) => {
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.queries.authQuery
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
      <AddInvestmentsPage fintechQuery={props.queries.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default AddInvestments;
