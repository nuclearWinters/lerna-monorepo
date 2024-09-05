import { graphql } from "react-relay/hooks";

export const approveLoansFragment = graphql`
  query ApproveLoanQueriesQuery @preloadable {
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
    reset: { type: "Float", defaultValue: 0 }
  )
  @refetchable(queryName: "ApproveLoansQueriesPaginationUser") {
    approveLoans(first: $count, after: $cursor, reset: $reset)
      @connection(key: "ApproveLoansQueries_user_approveLoans") {
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
          ...ApproveLoanQueriesRowRefetch_loan
        }
      }
    }
  }
`;

export const subscriptionApproveLoanUpdate = graphql`
  subscription ApproveLoanQueriesUpdateSubscription($gid: ID!) {
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
    }
  }
`;

export const approveLoanQueriesRowRefetchableFragment = graphql`
  fragment ApproveLoanQueriesRowRefetch_loan on Loan
  @refetchable(queryName: "ApproveLoanQueriesRefetchQuery") {
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
