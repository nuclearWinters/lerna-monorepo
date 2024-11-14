import {
  EntryPointComponent,
  RelayEnvironmentProvider,
  usePreloadedQuery,
} from "react-relay/hooks";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { MyTransactionsPage } from "../../../fintechSrc/screens/MyTransactions/MyTransactionsPage";
import { MyTransactionsQueriesQuery } from "../../../fintechSrc/screens/MyTransactions/__generated__/MyTransactionsQueriesQuery.graphql";
import { authUserQuery } from "../../utilsAuth";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";
import { OperationType } from "relay-runtime";

export interface Queries {
  [key: string]: OperationType;
  fintechQuery: MyTransactionsQueriesQuery;
  authQuery: utilsAuthQuery;
}

export const MyTransactions: EntryPointComponent<
  Queries,
  Record<string, undefined>
> = (props) => {
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.queries.authQuery
  );

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
