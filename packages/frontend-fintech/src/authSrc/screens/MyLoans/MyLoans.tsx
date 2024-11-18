import { type EntryPointComponent, RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import type { OperationType } from "relay-runtime";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { RedirectContainer } from "../../../components/RedirectContainer";
import { MyLoansPage } from "../../../fintechSrc/screens/MyLoans/MyLoansPage";
import type { MyLoansQueriesQuery } from "../../../fintechSrc/screens/MyLoans/__generated__/MyLoansQueriesQuery.graphql";
import type { Languages } from "../../../utils";
import type { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { authUserQuery } from "../../utilsAuth";

export interface Queries {
  [key: string]: OperationType;
  fintechQuery: MyLoansQueriesQuery;
  authQuery: utilsAuthQuery;
}

export const MyLoans: EntryPointComponent<Queries, Record<string, undefined>> = (props) => {
  const { authUser } = usePreloadedQuery(authUserQuery, props.queries.authQuery);

  if (!authUser) {
    return null;
  }

  const { isLender, isSupport, isBorrower, language } = authUser;

  if (isLender || isSupport) {
    return <RedirectContainer allowed={["borrower"]} isBorrower={isBorrower} isLender={isLender} isSupport={isSupport} />;
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <MyLoansPage fintechQuery={props.queries.fintechQuery} language={language as Languages} />
    </RelayEnvironmentProvider>
  );
};

export default MyLoans;
