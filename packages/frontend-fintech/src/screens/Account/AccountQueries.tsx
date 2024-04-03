import { graphql } from "relay-runtime";

export const accountFragment = graphql`
  query AccountQueriesQuery {
    user {
      accountAvailable
      accountToBePaid
      accountTotal
    }
  }
`;
