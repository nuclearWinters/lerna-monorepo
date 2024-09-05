import { graphql } from "react-relay/hooks";

export const fintechUserQuery = graphql`
  query utilsFintechQuery @preloadable {
    user {
      id
      accountAvailable
      accountTotal
    }
  }
`;
