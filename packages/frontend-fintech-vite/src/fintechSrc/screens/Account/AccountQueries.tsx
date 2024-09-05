import { graphql } from "react-relay/hooks";

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
