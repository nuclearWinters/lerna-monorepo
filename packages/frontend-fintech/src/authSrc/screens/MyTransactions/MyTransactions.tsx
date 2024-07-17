import { FC } from "react";
import { RelayEnvironmentProvider, usePreloadedQuery } from "react-relay/hooks";
import { SimpleEntryPointProps } from "../../../react-router-relay";
import { RelayEnvironmentFintech } from "../../../RelayEnvironment";
import { MyTransactionsPage } from "../../../fintechSrc/screens/MyTransactions/MyTransactions";
import { MyTransactionsQueriesQuery } from "../../../fintechSrc/screens/MyTransactions/__generated__/MyTransactionsQueriesQuery.graphql";
import { authUserQuery } from "../../utilsAuth";
import { utilsAuthQuery } from "../../__generated__/utilsAuthQuery.graphql";

type Props = SimpleEntryPointProps<{
  fintechQuery: MyTransactionsQueriesQuery;
  authQuery: utilsAuthQuery;
}>;

export const MyTransactions: FC<Props> = (props) => {
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
