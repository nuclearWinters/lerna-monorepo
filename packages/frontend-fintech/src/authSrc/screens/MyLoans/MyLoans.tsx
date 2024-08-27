import { FC } from "react";
import { RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import { RedirectContainer } from "../../../components/RedirectContainer";
import {
  EntryPointPrepared,
  EntryPointProps,
} from "../../../react-router-entrypoints/types";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { MyLoansPage } from "../../../fintechSrc/screens/MyLoans/MyLoansPage";
import { authUserQuery, Languages } from "../../utilsAuth";
import { MyLoansQueriesQuery } from "../../../fintechSrc/screens/MyLoans/__generated__/MyLoansQueriesQuery.graphql";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";

export type Queries = {
  fintechQuery: MyLoansQueriesQuery;
  authQuery: utilsAuthQuery;
};

export type PreparedProps = EntryPointPrepared<Queries>;

export type Props = EntryPointProps<Queries>;

export const MyLoans: FC<Props> = (props) => {
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.prepared.authQuery
  );

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower, language } = authUser;

  if (isLender || isSupport) {
    return (
      <RedirectContainer
        allowed={["borrower"]}
        isBorrower={isBorrower}
        isLender={isLender}
        isSupport={isSupport}
      />
    );
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <MyLoansPage
        fintechQuery={props.prepared.fintechQuery}
        language={language as Languages}
      />
    </RelayEnvironmentProvider>
  );
};

export default MyLoans;
