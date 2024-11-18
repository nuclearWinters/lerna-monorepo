import { type EntryPointComponent, RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import type { OperationType } from "relay-runtime";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { MyTransactionsPage } from "../../../fintechSrc/screens/MyTransactions/MyTransactionsPage";
import type { MyTransactionsQueriesQuery } from "../../../fintechSrc/screens/MyTransactions/__generated__/MyTransactionsQueriesQuery.graphql";
import type { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { authUserQuery } from "../../utilsAuth";

export interface Queries {
  [key: string]: OperationType;
  fintechQuery: MyTransactionsQueriesQuery;
  authQuery: utilsAuthQuery;
}

export const MyTransactions: EntryPointComponent<Queries, Record<string, undefined>> = (props) => {
  const { authUser } = usePreloadedQuery(authUserQuery, props.queries.authQuery);

  if (!authUser) {
    return null;
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <MyTransactionsPage fintechQuery={props.queries.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default MyTransactions;
