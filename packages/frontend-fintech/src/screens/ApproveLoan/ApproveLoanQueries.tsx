import { graphql } from "relay-runtime";

export const approveLoansFragment = graphql`
  query ApproveLoanQueriesQuery {
    user {
      id
      ...ApproveLoanQueries_user
    }
  }
`;

export const subscriptionApproveLoans = graphql`
  subscription ApproveLoanQueriesSubscription($connections: [ID!]!) {
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

export const ApproveLoansQueriesPaginationFragment = graphql`
  fragment ApproveLoanQueries_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
  )
  @refetchable(queryName: "ApproveLoansQueriesPaginationUser") {
    approveLoans(first: $count, after: $cursor)
      @connection(key: "ApproveLoansQueries_user_approveLoans") {
      edges {
        node {
          id
          ...LoanRow_loan
        }
      }
    }
  }
`;
