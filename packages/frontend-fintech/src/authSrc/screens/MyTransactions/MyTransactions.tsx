import { FC } from "react";
import { RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import {
  EntryPointPrepared,
  EntryPointProps,
} from "../../../react-router-entrypoints/types";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { MyTransactionsPage } from "../../../fintechSrc/screens/MyTransactions/MyTransactionsPage";
import { MyTransactionsQueriesQuery } from "../../../fintechSrc/screens/MyTransactions/__generated__/MyTransactionsQueriesQuery.graphql";
import { authUserQuery } from "../../utilsAuth";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";

export type Queries = {
  fintechQuery: MyTransactionsQueriesQuery;
  authQuery: utilsAuthQuery;
};

export type PreparedProps = EntryPointPrepared<Queries>;

export type Props = EntryPointProps<Queries>;

export const MyTransactions: FC<Props> = (props) => {
  const { authUser } = usePreloadedQuery(
    authUserQuery,
    props.prepared.authQuery
  );

  if (!authUser) {
    return null;
  }

  return (
    <RelayEnvironmentProvider environment={RelayEnvironmentFintech}>
      <MyTransactionsPage fintechQuery={props.prepared.fintechQuery} />
    </RelayEnvironmentProvider>
  );
};

export default MyTransactions;
