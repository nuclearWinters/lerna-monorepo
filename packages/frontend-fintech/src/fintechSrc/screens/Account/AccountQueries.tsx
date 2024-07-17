import { graphql } from "relay-runtime";

export const accountFragment = graphql`
  query AccountQueriesQuery @preloadable {
    user {
      accountAvailable
      accountToBePaid
      accountTotal
      accountWithheld
    }
  }
`;
