import { graphql } from "relay-runtime";

export const transactionsFragment = graphql`
  query MyTransactionsQueriesQuery {
    user {
      id
      ...MyTransactionsQueries_user
    }
  }
`;

export const subscriptionTransactions = graphql`
  subscription MyTransactionsQueriesSubscription($connections: [ID!]!) {
    transactions_subscribe_insert @prependEdge(connections: $connections) {
      node {
        __id
        ...InvestmentTransaction_transaction
          @module(name: "InvestmentTransaction")
        ...MoneyTransaction_transaction @module(name: "MoneyTransaction")
      }
      cursor
    }
  }
`;

export const transactionsPaginationFragment = graphql`
  fragment MyTransactionsQueries_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
    reset: { type: "Float", defaultValue: 0 }
  )
  @refetchable(queryName: "MyTransactionsQueriesPaginationUser") {
    transactions(first: $count, after: $cursor, reset: $reset)
      @connection(key: "MyTransactionsQueries_user_transactions") {
      edges {
        node {
          __id
          ...InvestmentTransaction_transaction
            @module(name: "InvestmentTransaction")
          ...MoneyTransaction_transaction @module(name: "MoneyTransaction")
        }
      }
    }
  }
`;
