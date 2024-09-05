import { graphql } from "react-relay/hooks";

export const subscriptionInvestments = graphql`
  subscription MyInvestmentsQueriesSubscription(
    $connections: [ID!]!
    $status: [InvestmentStatus!]
  ) {
    investments_subscribe_insert(status: $status)
      @prependEdge(connections: $connections) {
      node {
        id
        borrower_id
        lender_id
        loan_id
        quantity
        ROI
        payments
        term
        moratory
        created_at
        updated_at
        status
        interest_to_earn
        paid_already
        to_be_paid
      }
      cursor
    }
  }
`;

export const subscriptionInvestmentsUpdate = graphql`
  subscription MyInvestmentsQueriesUpdateSubscription {
    investments_subscribe_update {
      id
      borrower_id
      lender_id
      loan_id
      quantity
      ROI
      payments
      term
      moratory
      created_at
      updated_at
      status
      interest_to_earn
      paid_already
      to_be_paid
    }
  }
`;

export const myInvestmentsFragment = graphql`
  query MyInvestmentsQueriesQuery @preloadable {
    user {
      id
      ...MyInvestmentsQueries_user
    }
  }
`;

export const myInvestmentsPaginationFragment = graphql`
  fragment MyInvestmentsQueries_user on User
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 5 }
    cursor: { type: "String", defaultValue: "" }
    status: { type: "[InvestmentStatus!]", defaultValue: null }
    reset: { type: "Float", defaultValue: 0 }
  )
  @refetchable(queryName: "MyInvestmentsQueriesPaginationUser") {
    investments(first: $count, after: $cursor, status: $status, reset: $reset)
      @connection(key: "MyInvestmentsQueries_user_investments") {
      edges {
        node {
          id
          borrower_id
          loan_id
          quantity
          created_at
          updated_at
          status
          payments
          ROI
          term
          moratory
          interest_to_earn
          paid_already
          to_be_paid
          ...MyInvestmentsQueriesRow_investment
        }
      }
    }
  }
`;

export const investmentRowRefetchableFragment = graphql`
  fragment MyInvestmentsQueriesRow_investment on Investment
  @refetchable(queryName: "MyInvestmentRowRefetchQuery") {
    id
    borrower_id
    loan_id
    quantity
    created_at
    updated_at
    status
    payments
    ROI
    term
    moratory
    interest_to_earn
    paid_already
    to_be_paid
  }
`;
