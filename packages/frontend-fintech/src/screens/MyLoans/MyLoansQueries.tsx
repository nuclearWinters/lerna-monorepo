import { graphql } from "relay-runtime";

export const myLoansFragment = graphql`
  query MyLoansQueriesQuery {
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
  )
  @refetchable(queryName: "MyLoansQueriesPaginationUser") {
    myLoans(first: $count, after: $cursor)
      @connection(key: "MyLoansQueries_user_myLoans") {
      edges {
        node {
          id
          ...LoanRow_loan
        }
      }
    }
  }
`;
