import { graphql } from "react-relay/hooks";

export const myLoansFragment = graphql`
  query MyLoansQueriesQuery @preloadable {
    user {
      id
      ...MyLoansQueries_user
    }
  }
`;

export const subscriptionMyLoans = graphql`
  subscription MyLoansQueriesSubscription($connections: [ID!]!) {
    my_loans_subscribe_insert @prependEdge(connections: $connections) {
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

export const myLoansPaginationFragment = graphql`
  fragment MyLoansQueries_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
    reset: { type: "Float", defaultValue: 0 }
  )
  @refetchable(queryName: "MyLoansQueriesPaginationUser") {
    myLoans(first: $count, after: $cursor, reset: $reset)
      @connection(key: "MyLoansQueries_user_myLoans") {
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
          status
          pending
          ...MyLoansQueriesRowRefetch_loan
        }
      }
    }
  }
`;

export const subscriptionMyLoansUpdate = graphql`
  subscription MyLoansQueriesUpdateSubscription($gid: ID!) {
    loans_subscribe_update(gid: $gid) {
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
    }
  }
`;

export const myLoansQueriesRowRefetchableFragment = graphql`
  fragment MyLoansQueriesRowRefetch_loan on Loan
  @refetchable(queryName: "MyLoansQueriesRefetchQuery") {
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
  }
`;
