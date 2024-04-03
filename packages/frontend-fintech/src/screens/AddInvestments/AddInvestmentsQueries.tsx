import { graphql } from "relay-runtime";

export const subscriptionLoans = graphql`
  subscription AddInvestmentsQueriesLoansSubscription($connections: [ID!]!) {
    loans_subscribe_insert @prependEdge(connections: $connections) {
      node {
        id
        user_id
        score
        ROI
        goal
        term
        raised
        expiry
        status
        pending
        pendingCents
      }
      cursor
    }
  }
`;

export const addInvestmentFragment = graphql`
  query AddInvestmentsQueriesQuery {
    __id
    user {
      ...AddInvestmentsQueries_user
    }
  }
`;

export const addInvestmentPaginationFragment = graphql`
  fragment AddInvestmentsQueries_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "AddInvestmentsQueriesPaginationQuery") {
    loansFinancing(first: $count, after: $cursor)
      @connection(key: "AddInvestmentsQueries_query_loansFinancing") {
      __id
      edges {
        node {
          id
          ...LoanRow_loan
        }
      }
    }
  }
`;
