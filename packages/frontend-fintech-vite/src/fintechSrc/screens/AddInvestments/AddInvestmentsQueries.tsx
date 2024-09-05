import { graphql } from "react-relay/hooks";

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
  query AddInvestmentsQueriesQuery @preloadable {
    user {
      id
      ...AddInvestmentsQueries_user
    }
  }
`;

export const addInvestmentPaginationFragment = graphql`
  fragment AddInvestmentsQueries_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
    reset: { type: "Float", defaultValue: 0 }
  )
  @refetchable(queryName: "AddInvestmentsQueriesPaginationQuery") {
    loansFinancing(first: $count, after: $cursor, reset: $reset)
      @connection(key: "AddInvestmentsQueries_query_loansFinancing") {
      edges {
        node {
          id
          user_id
          score
          ROI
          goal
          term
          raised
          expiry
          pending
          pendingCents
          ...AddInvestmentsQueriesRowRefetch_loan
        }
      }
    }
  }
`;

export const subscriptionAddInvestmentsUpdate = graphql`
  subscription AddInvestmentsQueriesUpdateSubscription($gid: ID!) {
    loans_subscribe_update(gid: $gid) {
      id
      user_id
      score
      ROI
      goal
      term
      raised
      expiry
      pending
      pendingCents
    }
  }
`;

export const addInvestmentsQueriesRowRefetchableFragment = graphql`
  fragment AddInvestmentsQueriesRowRefetch_loan on Loan
  @refetchable(queryName: "AddInvestmentQueriesRefetchQuery") {
    id
    user_id
    score
    ROI
    goal
    term
    raised
    expiry
    pending
    pendingCents
  }
`;
