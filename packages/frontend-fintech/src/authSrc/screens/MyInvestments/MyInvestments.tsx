import { FC } from "react";
import { usePreloadedQuery, RelayEnvironmentProvider } from "react-relay/hooks";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { SimpleEntryPointProps } from "../../../react-router-relay";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { MyInvestmentsPage } from "../../../fintechSrc/screens/MyInvestments/MyInvestmentsPage";
import { MyInvestmentsQueriesQuery } from "../../../fintechSrc/screens/MyInvestments/__generated__/MyInvestmentsQueriesQuery.graphql";
import { authUserQuery } from "../../utilsAuth";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";

type Props = SimpleEntryPointProps<{
  fintechQuery: MyInvestmentsQueriesQuery;
  authQuery: utilsAuthQuery;
}>;

export const MyInvestments: FC<Props> = (props) => {
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.queries.authQuery
  );

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower } = authUser;

  if (isSupport || isBorrower) {
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
      <MyInvestmentsPage fintechQuery={props.queries.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default MyInvestments;
