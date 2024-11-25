import { graphql } from "relay-runtime";

export const fintechUserQuery = graphql`
  query utilsFintechQuery @preloadable {
    user {
      id
      accountAvailable
      accountTotal
    }
  }
`;
